"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { updateSettings } from "@/lib/data";
import { uploadProductImage } from "@/lib/storage";

export async function updateSettingsAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Non autorisé");

  const str = (k: string) => {
    const s = String(formData.get(k) ?? "").trim();
    return s || null;
  };
  const num = (k: string) => {
    const s = String(formData.get(k) ?? "").trim();
    if (!s) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  };

  // optional new logo upload
  const file = formData.get("logo");
  let logoUrl: string | undefined;
  if (file instanceof File && file.size > 0) {
    logoUrl = await uploadProductImage(file);
  }

  await updateSettings({
    siteName: String(formData.get("siteName") ?? "").trim() || "Filtre Maroc",
    ...(logoUrl ? { logoUrl } : {}),
    phone1: String(formData.get("phone1") ?? "").trim(),
    phone2: str("phone2"),
    email: str("email"),
    whatsapp: str("whatsapp"),
    addressText: str("addressText"),
    mapLat: num("mapLat"),
    mapLng: num("mapLng"),
    facebook: str("facebook"),
    instagram: str("instagram"),
    tiktok: str("tiktok"),
    announcement: str("announcement"),
    freeDeliveryThreshold: num("freeDeliveryThreshold") ?? 1000,
  });

  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
}
