import { getInstallations, getPlombiers } from "@/lib/data";
import { ClientsSuivi } from "@/components/admin/clients-suivi";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  const [installations, plombiers] = await Promise.all([getInstallations(), getPlombiers()]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Suivi client</h1>
        <p className="text-sm text-ink-soft">
          Clients équipés — garantie et entretien des filtres (rappel tous les 6 mois).
        </p>
      </div>
      <ClientsSuivi installations={installations} plombiers={plombiers} />
    </div>
  );
}
