"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const ROLES = ["admin", "confirmateur", "plombier"] as const;

async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error("Non autorisé");
  // Fall back to the DB role for sessions issued before roles existed.
  let role = session.role;
  if (!role) {
    const u = await prisma.adminUser.findUnique({
      where: { id: session.sub },
      select: { role: true },
    });
    role = u?.role;
  }
  if (role !== "admin") throw new Error("Non autorisé");
  return session;
}

/** Admin: create a staff account (confirmateur / plombier / admin). */
export async function createStaffUserAction(input: {
  email: string;
  name: string;
  password: string;
  role: string;
}): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();

  const email = (input.email ?? "").trim().toLowerCase();
  const name = (input.name ?? "").trim();
  const password = input.password ?? "";
  const role = input.role;

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return { ok: false, error: "Adresse email invalide." };
  if (password.length < 8)
    return { ok: false, error: "Le mot de passe doit faire au moins 8 caractères." };
  if (!ROLES.includes(role as (typeof ROLES)[number]))
    return { ok: false, error: "Rôle invalide." };

  const exists = await prisma.adminUser.findUnique({ where: { email } });
  if (exists) return { ok: false, error: "Cet email est déjà utilisé." };

  await prisma.adminUser.create({
    data: {
      email,
      name: name || null,
      role,
      passwordHash: await bcrypt.hash(password, 10),
    },
  });
  revalidatePath("/admin/users");
  return { ok: true };
}

/** Admin: edit a staff account (name, email, role, and optionally reset password). */
export async function updateStaffUserAction(
  id: string,
  input: { email: string; name: string; role: string; password?: string },
): Promise<{ ok: boolean; error?: string }> {
  const session = await requireAdmin();

  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (!target) return { ok: false, error: "Compte introuvable." };

  const email = (input.email ?? "").trim().toLowerCase();
  const name = (input.name ?? "").trim();
  const role = input.role;
  const password = input.password ?? "";

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return { ok: false, error: "Adresse email invalide." };
  if (!ROLES.includes(role as (typeof ROLES)[number]))
    return { ok: false, error: "Rôle invalide." };
  if (password && password.length < 8)
    return { ok: false, error: "Le mot de passe doit faire au moins 8 caractères." };

  // email must stay unique
  if (email !== target.email) {
    const exists = await prisma.adminUser.findUnique({ where: { email } });
    if (exists && exists.id !== id) return { ok: false, error: "Cet email est déjà utilisé." };
  }

  // don't let someone change their own role (could lock themselves out)
  if (id === session.sub && role !== target.role)
    return { ok: false, error: "Vous ne pouvez pas changer votre propre rôle." };

  // don't demote the last admin
  if (target.role === "admin" && role !== "admin") {
    const adminCount = await prisma.adminUser.count({ where: { role: "admin" } });
    if (adminCount <= 1) return { ok: false, error: "Impossible de retirer le dernier administrateur." };
  }

  await prisma.adminUser.update({
    where: { id },
    data: {
      email,
      name: name || null,
      role,
      ...(password ? { passwordHash: await bcrypt.hash(password, 10) } : {}),
    },
  });
  revalidatePath("/admin/users");
  return { ok: true };
}

/** Admin: delete a staff account (cannot delete yourself or the last admin). */
export async function deleteStaffUserAction(id: string): Promise<{ ok: boolean; error?: string }> {
  const session = await requireAdmin();
  if (id === session.sub) return { ok: false, error: "Vous ne pouvez pas supprimer votre propre compte." };

  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (!target) return { ok: false, error: "Compte introuvable." };

  if (target.role === "admin") {
    const adminCount = await prisma.adminUser.count({ where: { role: "admin" } });
    if (adminCount <= 1) return { ok: false, error: "Impossible de supprimer le dernier administrateur." };
  }

  await prisma.adminUser.delete({ where: { id } });
  revalidatePath("/admin/users");
  return { ok: true };
}
