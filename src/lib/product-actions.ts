"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductBySlug,
  type ProductInput,
} from "@/lib/data";
import { uploadProductImage } from "@/lib/storage";
import type { Spec } from "@/lib/types";

const AR: Record<string, string> = {
  "ا": "a", "أ": "a", "إ": "i", "آ": "a", "ب": "b", "ت": "t", "ث": "th",
  "ج": "j", "ح": "h", "خ": "kh", "د": "d", "ذ": "dh", "ر": "r", "ز": "z",
  "س": "s", "ش": "sh", "ص": "s", "ض": "d", "ط": "t", "ظ": "z", "ع": "a",
  "غ": "gh", "ف": "f", "ق": "q", "ك": "k", "ل": "l", "م": "m", "ن": "n",
  "ه": "h", "و": "w", "ي": "y", "ى": "a", "ة": "a",
};

function asciiSlug(s: string): string {
  let out = "";
  for (const ch of s) {
    if (/[a-zA-Z0-9]/.test(ch)) out += ch;
    else if (AR[ch] !== undefined) out += AR[ch];
    else out += "-";
  }
  out = out.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (out.length > 55) out = out.slice(0, 55).replace(/-[^-]*$/, "");
  if (out.replace(/-/g, "").length < 2) out = "produit";
  return out;
}

async function uniqueSlug(name: string): Promise<string> {
  const base = asciiSlug(name);
  let slug = base;
  let i = 2;
  while (await getProductBySlug(slug)) slug = `${base}-${i++}`;
  return slug;
}

function num(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export async function saveProductAction(
  id: string | null,
  formData: FormData,
): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Non autorisé");

  const name = String(formData.get("name") ?? "").trim();
  const categorySlug = String(formData.get("category") ?? "cuisine");
  const price = num(formData.get("price")) ?? 0;
  const oldPrice = num(formData.get("oldPrice"));
  const stages = num(formData.get("stages"));
  const capacity = String(formData.get("capacity") ?? "").trim() || null;
  const warranty = String(formData.get("warranty") ?? "").trim() || null;
  const stock = num(formData.get("stock")) ?? 100;
  const shortDescription = String(formData.get("shortDescription") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const features = String(formData.get("features") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const badges = formData.getAll("badges").map(String);
  const inStock = formData.get("inStock") != null;
  const hue = num(formData.get("hue")) ?? 205;

  // server-side validation
  if (name.length < 2) throw new Error("Le nom du produit est requis.");
  if (!Number.isFinite(price) || price <= 0)
    throw new Error("Le prix doit être un nombre supérieur à 0.");
  if (stock < 0) throw new Error("Le stock ne peut pas être négatif.");

  // images: keep existing (edit) + upload new files
  let images: string[] = [];
  const existing = String(formData.get("existingImages") ?? "");
  if (existing) {
    try {
      images = JSON.parse(existing) as string[];
    } catch {
      /* ignore */
    }
  }
  const files = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);
  for (const f of files) {
    images.push(await uploadProductImage(f));
  }

  const specs: Spec[] = [];
  if (stages) specs.push({ label: "Étapes", value: String(stages) });
  if (capacity) specs.push({ label: "Débit", value: capacity });
  if (warranty) specs.push({ label: "Garantie", value: warranty });

  const slug = id
    ? String(formData.get("slug") ?? "") || (await uniqueSlug(name))
    : await uniqueSlug(name);

  const input: ProductInput = {
    slug,
    name,
    categorySlug,
    shortDescription,
    description,
    price,
    oldPrice,
    stages,
    capacity,
    warranty,
    badges,
    inStock,
    stock,
    bestSeller: badges.includes("Best Seller"),
    hue,
    images,
    features,
    specs,
  };

  if (id) await updateProduct(id, input);
  else await createProduct(input);

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProductAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Non autorisé");
  await deleteProduct(id);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}
