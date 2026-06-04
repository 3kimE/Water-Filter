"use client";

/**
 * Custom next/image loader that returns the source URL unchanged.
 *
 * This bypasses the built-in Image Optimization API (`/_next/image`) entirely.
 * On Vercel that optimizer rejects our external Supabase Storage URLs with
 * HTTP 400 (and `images.unoptimized` is ignored by the Turbopack production
 * build), which made every product photo break once deployed. Serving the
 * images straight from their source is reliable in every environment.
 */
export default function imageLoader({ src }: { src: string }) {
  return src;
}
