/**
 * Hero graphic: a clean glass of pure water with bubbles and a droplet
 * splashing in. Pure SVG (sharp, light, offline-safe). Sits on the blue
 * hero card on the homepage.
 */
export function HeroGlass({ className = "h-72 w-64" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 270"
      className={className}
      role="img"
      aria-label="Verre d'eau pure"
      fill="none"
    >
      <defs>
        <linearGradient id="fmWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bdeafd" />
          <stop offset="100%" stopColor="#46a8e4" />
        </linearGradient>
        <linearGradient id="fmDrop2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eaf8ff" />
          <stop offset="100%" stopColor="#8fd0f4" />
        </linearGradient>
      </defs>

      {/* falling droplet */}
      <g className="animate-float">
        <path
          d="M110 22 C110 22 99 40 99 48 a11 11 0 0 0 22 0 C121 40 110 22 110 22 Z"
          fill="url(#fmDrop2)"
        />
      </g>

      {/* glass inner fill (subtle) */}
      <path
        d="M64 84 L78 226 Q80 234 90 234 L130 234 Q140 234 142 226 L156 84 Z"
        fill="#ffffff"
        fillOpacity="0.08"
      />

      {/* water */}
      <path
        d="M70 130 C96 122 124 122 150 130 L141 224 Q139.5 230 133 230 L87 230 Q80.5 230 79 224 Z"
        fill="url(#fmWater)"
        fillOpacity="0.92"
      />
      {/* water surface line */}
      <path
        d="M70 130 C96 122 124 122 150 130"
        stroke="#ffffff"
        strokeOpacity="0.7"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* bubbles */}
      <circle cx="96" cy="172" r="4" fill="#ffffff" fillOpacity="0.6" className="animate-float" style={{ animationDelay: "0.2s" }} />
      <circle cx="121" cy="152" r="3" fill="#ffffff" fillOpacity="0.55" className="animate-float" style={{ animationDelay: "0.7s" }} />
      <circle cx="110" cy="196" r="5" fill="#ffffff" fillOpacity="0.45" className="animate-float" style={{ animationDelay: "1.1s" }} />
      <circle cx="133" cy="182" r="2.5" fill="#ffffff" fillOpacity="0.55" className="animate-float" style={{ animationDelay: "0.45s" }} />

      {/* glass body outline */}
      <path
        d="M64 84 L78 226 Q80 234 90 234 L130 234 Q140 234 142 226 L156 84"
        stroke="#ffffff"
        strokeOpacity="0.92"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* glass rim */}
      <ellipse cx="110" cy="84" rx="46" ry="9" stroke="#ffffff" strokeOpacity="0.92" strokeWidth="3.5" />
      {/* left shine */}
      <path d="M80 102 L88 208" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
