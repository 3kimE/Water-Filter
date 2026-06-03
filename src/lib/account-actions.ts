"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession, createSession } from "@/lib/auth";

export type AccountState = { error: string | null; ok?: boolean };

export async function updateAdminAccountAction(
  _prev: AccountState,
  formData: FormData,
): Promise<AccountState> {
  const session = await getSession();
  if (!session) return { error: "Session expirée. Reconnectez-vous." };

  const admin = await prisma.adminUser.findUnique({ where: { id: session.sub } });
  if (!admin) return { error: "Compte introuvable." };

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newEmail = String(formData.get("newEmail") ?? "").trim().toLowerCase();
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  // current password is required and must match
  const ok = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!ok) return { error: "Mot de passe actuel incorrect." };

  const data: { email?: string; passwordHash?: string } = {};

  if (newEmail && newEmail !== admin.email) {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(newEmail))
      return { error: "Adresse email invalide." };
    const exists = await prisma.adminUser.findUnique({ where: { email: newEmail } });
    if (exists && exists.id !== admin.id)
      return { error: "Cet email est déjà utilisé." };
    data.email = newEmail;
  }

  if (newPassword) {
    if (newPassword.length < 8)
      return { error: "Le nouveau mot de passe doit faire au moins 8 caractères." };
    if (newPassword !== confirmPassword)
      return { error: "Les mots de passe ne correspondent pas." };
    data.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  if (!data.email && !data.passwordHash)
    return { error: "Aucune modification à enregistrer." };

  await prisma.adminUser.update({ where: { id: admin.id }, data });
  // refresh the session so the email claim stays in sync
  await createSession({ id: admin.id, email: data.email ?? admin.email });

  return { error: null, ok: true };
}
