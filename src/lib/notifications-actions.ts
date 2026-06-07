"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
  getAdminNotifications,
  getConfirmationNotifications,
  getPlombierNotifications,
  type AdminNotifications,
  type StaffNotif,
} from "@/lib/data";

/** Live notifications for the admin bell (auth-gated). */
export async function fetchNotificationsAction(): Promise<AdminNotifications | null> {
  const session = await getSession();
  if (!session) return null;
  return getAdminNotifications();
}

/** Live notifications for the confirmateur / plombier bell (auth-gated by area). */
export async function fetchStaffNotificationsAction(
  area: "confirmation" | "plombier",
): Promise<StaffNotif | null> {
  const session = await getSession();
  if (!session) return null;

  // Resolve role (fall back to DB for sessions issued before roles existed).
  let role = session.role;
  if (!role) {
    const u = await prisma.adminUser.findUnique({
      where: { id: session.sub },
      select: { role: true },
    });
    role = u?.role;
  }

  if (area === "confirmation") {
    if (role !== "confirmateur" && role !== "admin") return null;
    return getConfirmationNotifications();
  }
  // area === "plombier"
  if (role !== "plombier" && role !== "admin") return null;
  return getPlombierNotifications(session.email, role === "admin");
}
