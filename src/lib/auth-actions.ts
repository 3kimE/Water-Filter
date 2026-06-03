"use server";

import { redirect } from "next/navigation";
import { verifyCredentials, createSession, destroySession } from "@/lib/auth";

export type LoginState = { error: string | null };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
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
