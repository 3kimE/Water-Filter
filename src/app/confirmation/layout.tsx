import { StaffShell } from "@/components/staff/staff-shell";

export const dynamic = "force-dynamic";

export default function ConfirmationLayout({ children }: { children: React.ReactNode }) {
  return (
    <StaffShell title="Commandes à confirmer" subtitle="Espace Confirmateur">
      {children}
    </StaffShell>
  );
}
