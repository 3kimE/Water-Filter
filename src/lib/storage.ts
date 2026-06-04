import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "products";

let _client: SupabaseClient | null = null;

/**
 * Server-side Supabase client with full access (NEVER expose to the browser).
 * Created lazily so importing this module never crashes the build when the
 * env vars are absent — it only fails if an upload is actually attempted.
 */
function getSupabaseAdmin(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Configuration Supabase manquante (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).",
    );
  }
  _client = createClient(url, serviceKey, { auth: { persistSession: false } });
  return _client;
}

let bucketReady: Promise<void> | null = null;
async function ensureBucket() {
  if (!bucketReady) {
    bucketReady = (async () => {
      const { error } = await getSupabaseAdmin().storage.createBucket(BUCKET, {
        public: true,
      });
      if (error && !/exist/i.test(error.message)) throw error;
    })().catch((e) => {
      bucketReady = null;
      throw e;
    });
  }
  return bucketReady;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/** Upload one image file to Supabase Storage and return its public URL. */
export async function uploadProductImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Format d'image non supporté (JPG, PNG ou WebP).");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image trop lourde (5 Mo maximum).");
  }
  await ensureBucket();
  const supabaseAdmin = getSupabaseAdmin();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext || "jpg"}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabaseAdmin.storage.from(BUCKET).upload(key, bytes, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) throw error;
  return supabaseAdmin.storage.from(BUCKET).getPublicUrl(key).data.publicUrl;
}
