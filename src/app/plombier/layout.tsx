import { StaffShell } from "@/components/staff/staff-shell";

export const dynamic = "force-dynamic";

export default function PlombierLayout({ children }: { children: React.ReactNode }) {
  return (
    <StaffShell title="Mes installations" subtitle="Espace Plombier">
      {children}
    </StaffShell>
  );
}
