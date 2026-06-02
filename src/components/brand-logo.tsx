/**
 * Crisp, scalable brand mark — a water droplet in the brand blues.
 * Replaces the raster logo.jpeg in the header/footer/admin.
 * Pure SVG: sharp at any size, tiny, and matches the flat UI style.
 */
export function BrandLogo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="Filtre Maroc"
    >
      <defs>
        <linearGradient id="fmDrop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9ad8f7" />
          <stop offset="45%" stopColor="#2b9fe0" />
          <stop offset="100%" stopColor="#0e3c5f" />
        </linearGradient>
      </defs>
      {/* droplet */}
      <path
        d="M24 3 C24 3 8 21 8 31 C8 39.8 15.2 47 24 47 C32.8 47 40 39.8 40 31 C40 21 24 3 24 3 Z"
        fill="url(#fmDrop)"
      />
      {/* glossy highlight */}
      <ellipse cx="18" cy="30" rx="3.4" ry="6" fill="#ffffff" opacity="0.45" />
    </svg>
  );
}
