"use server";

import { getSession } from "@/lib/auth";
import { getAdminNotifications, type AdminNotifications } from "@/lib/data";

/** Live notifications for the admin bell (auth-gated). */
export async function fetchNotificationsAction(): Promise<AdminNotifications | null> {
  const session = await getSession();
  if (!session) return null;
  return getAdminNotifications();
}
