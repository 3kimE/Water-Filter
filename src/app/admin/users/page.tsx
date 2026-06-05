import { getStaffUsers } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { UsersManager } from "@/components/admin/users-manager";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const [users, session] = await Promise.all([getStaffUsers(), getSession()]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Utilisateurs</h1>
        <p className="text-sm text-ink-soft">
          Gérez les accès : confirmateur (appels) et plombier (installations).
        </p>
      </div>
      <UsersManager users={users} currentUserId={session?.sub ?? ""} />
    </div>
  );
}
