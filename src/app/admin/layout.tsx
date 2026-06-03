import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminNotifications } from "@/lib/data";

export const metadata: Metadata = {
  title: "Admin — Filtre Maroc",
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const notifications = await getAdminNotifications();
  return <AdminShell notifications={notifications}>{children}</AdminShell>;
}
