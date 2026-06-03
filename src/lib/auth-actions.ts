"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { verifyCredentials, createSession, destroySession } from "@/lib/auth";
import { rateLimit, ipFrom } from "@/lib/rate-limit";

export type LoginState = { error: string | null };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const ip = ipFrom(await headers());
  if (!rateLimit(`login:${ip}`, 5, 15 * 60 * 1000).ok) {
    return { error: "Trop de tentatives. Réessayez dans 15 minutes." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Veuillez remplir tous les champs." };

  const user = await verifyCredentials(email, password);
  if (!user) return { error: "Email ou mot de passe incorrect." };

  await createSession(user);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
