/**
 * Animated SVG hero scene — a friendly robot mascot surrounded by
 * floating note cards and sparkles. All motion is CSS-driven (see
 * .hero-scene rules in index.css), so it loads instantly and stays
 * on-theme in both light and dark mode.
 */
export default function HeroScene() {
  return (
    <svg
      className="hero-scene"
      viewBox="0 0 420 380"
      fill="none"
      role="img"
      aria-label="Peblo AI robot organising notes"
    >
      {/* soft glow halo */}
      <circle className="hs-halo" cx="210" cy="190" r="150" fill="var(--accent-soft)" />
      <circle className="hs-halo2" cx="210" cy="190" r="110" fill="var(--accent-soft)" opacity="0.6" />

      {/* floating note card — top left */}
      <g className="hs-float hs-float-a">
        <rect x="40" y="60" width="92" height="74" rx="11"
          fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="2" />
        <path d="M56 82h60M56 96h60M56 110h36"
          stroke="var(--border-strong)" strokeWidth="3.5" strokeLinecap="round" />
      </g>

      {/* floating note card — bottom right */}
      <g className="hs-float hs-float-b">
        <rect x="292" y="232" width="88" height="70" rx="11"
          fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="2" />
        <path d="M308 252h56M308 266h56M308 280h32"
          stroke="var(--border-strong)" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="370" cy="234" r="13" fill="var(--accent)" />
        <path d="M370 228v12M364 234h12" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      </g>

      {/* ---- robot mascot ---- */}
      <g className="hs-robot">
        {/* antenna */}
        <line x1="210" y1="96" x2="210" y2="74" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" />
        <circle className="hs-antenna" cx="210" cy="68" r="9" fill="var(--accent)" />

        {/* head */}
        <rect x="150" y="96" width="120" height="100" rx="26"
          fill="var(--surface)" stroke="var(--text)" strokeWidth="3.5" />

        {/* face screen */}
        <rect x="166" y="114" width="88" height="64" rx="16" fill="var(--text)" />

        {/* eyes — blink via CSS scaleY */}
        <g className="hs-eyes">
          <circle cx="192" cy="142" r="9" fill="var(--accent)" />
          <circle cx="228" cy="142" r="9" fill="var(--accent)" />
        </g>
        {/* smile */}
        <path d="M188 160q22 16 44 0" stroke="var(--accent)" strokeWidth="4"
          strokeLinecap="round" fill="none" />

        {/* ears */}
        <rect x="138" y="128" width="14" height="34" rx="6" fill="var(--accent)" />
        <rect x="268" y="128" width="14" height="34" rx="6" fill="var(--accent)" />

        {/* body */}
        <rect x="164" y="200" width="92" height="74" rx="20"
          fill="var(--surface)" stroke="var(--text)" strokeWidth="3.5" />
        {/* chest spark badge */}
        <circle cx="210" cy="234" r="20" fill="var(--accent-soft)" />
        <path className="hs-chest"
          d="M210 220l3.4 9.6 9.6 3.4-9.6 3.4-3.4 9.6-3.4-9.6-9.6-3.4 9.6-3.4z"
          fill="var(--accent)" />

        {/* arms */}
        <path className="hs-arm-l" d="M164 214q-30 6-30 40"
          stroke="var(--text)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <circle cx="134" cy="254" r="9" fill="var(--accent)" />
        <path className="hs-arm-r" d="M256 214q30 6 30 40"
          stroke="var(--text)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <circle cx="286" cy="254" r="9" fill="var(--accent)" />
      </g>

      {/* drifting sparkles */}
      <g className="hs-sparkle hs-sparkle-1" fill="var(--accent)">
        <path d="M96 168l2.6 7 7 2.6-7 2.6-2.6 7-2.6-7-7-2.6 7-2.6z" />
      </g>
      <g className="hs-sparkle hs-sparkle-2" fill="var(--accent)">
        <path d="M320 110l2 5.4 5.4 2-5.4 2-2 5.4-2-5.4-5.4-2 5.4-2z" />
      </g>
      <g className="hs-sparkle hs-sparkle-3" fill="var(--accent)">
        <path d="M114 296l2.2 6 6 2.2-6 2.2-2.2 6-2.2-6-6-2.2 6-2.2z" />
      </g>
    </svg>
  );
}
