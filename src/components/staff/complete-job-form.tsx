"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Camera, Check } from "lucide-react";
import { completeInstallationAction } from "@/lib/order-actions";

export function CompleteJobForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!file) {
      setError("Ajoutez une photo de l'installation terminée.");
      return;
    }
    const fd = new FormData();
    fd.set("orderId", orderId);
    fd.set("photo", file);
    startTransition(async () => {
      const res = await completeInstallationAction(fd);
      if (res.ok) router.refresh();
      else setError(res.error ?? "Erreur.");
    });
  }

  return (
    <form onSubmit={submit} className="mt-4 border-t border-slate-100 pt-3">
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm font-medium text-ink-soft transition hover:border-brand-300 hover:text-brand-600">
        <Camera className="h-5 w-5" />
        {file ? "Changer la photo" : "Photo de l'installation"}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>
      {file && (
        <p className="mt-1 truncate text-xs text-emerald-600">✓ {file.name}</p>
      )}
      {error && <p className="mt-1 text-sm text-rose-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
      >
        <Check className="h-4 w-4" /> {pending ? "Envoi…" : "Marquer comme installé"}
      </button>
    </form>
  );
}
