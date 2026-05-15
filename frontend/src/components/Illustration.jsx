/**
 * Decorative SVG illustrations — used on empty states and the auth page.
 * Drawn with theme tokens so they adapt to light/dark mode.
 */

/** A stack of paper notes — empty notes list. */
export function EmptyNotesArt({ size = 150 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <rect
        x="46" y="58" width="100" height="120" rx="10"
        fill="var(--surface-2)" stroke="var(--border)" strokeWidth="2"
        transform="rotate(-8 96 118)"
      />
      <rect
        x="54" y="44" width="100" height="120" rx="10"
        fill="var(--surface)" stroke="var(--border)" strokeWidth="2"
      />
      <path d="M70 74h68M70 90h68M70 106h44" stroke="var(--border)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="148" cy="48" r="20" fill="var(--accent-soft)" />
      <path
        d="M148 40v16M140 48h16" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round"
      />
    </svg>
  );
}

/** A magnifying glass over a page — empty search results. */
export function EmptySearchArt({ size = 140 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <rect
        x="48" y="40" width="86" height="110" rx="10"
        fill="var(--surface)" stroke="var(--border)" strokeWidth="2"
      />
      <path d="M64 66h54M64 82h54M64 98h32" stroke="var(--border)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="120" cy="120" r="30" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="3" />
      <path d="M141 141l18 18" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

/** A small abstract mark used as the brand logo. */
export function BrandLogo({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="3" y="3" width="26" height="26" rx="8" fill="var(--accent)" />
      <path
        d="M11 22V10h6a4 4 0 0 1 0 8h-6"
        stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

/** Soft layered decoration for the auth side panel. */
export function AuthHeroArt() {
  return (
    <svg viewBox="0 0 400 400" fill="none" width="100%" style={{ maxWidth: 360 }}>
      <circle cx="200" cy="200" r="150" fill="var(--accent-soft)" />
      <rect
        x="120" y="96" width="150" height="190" rx="16"
        fill="var(--surface)" stroke="var(--border)" strokeWidth="2.5"
        transform="rotate(-6 195 191)"
      />
      <rect
        x="135" y="110" width="150" height="190" rx="16"
        fill="var(--surface)" stroke="var(--border)" strokeWidth="2.5"
      />
      <path
        d="M158 142h104M158 164h104M158 186h68"
        stroke="var(--border)" strokeWidth="4" strokeLinecap="round"
      />
      <rect x="158" y="214" width="104" height="52" rx="10" fill="var(--accent-soft)" />
      <path
        d="M174 240l1.6-4.4 1.6 4.4 4.4 1.6-4.4 1.6-1.6 4.4-1.6-4.4-4.4-1.6z"
        fill="var(--accent)"
      />
      <path d="M192 234h54M192 246h38" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" opacity="0.7" />
      <circle cx="288" cy="120" r="26" fill="var(--accent)" />
      <path
        d="M288 110l2.4 6.6 6.6 2.4-6.6 2.4-2.4 6.6-2.4-6.6-6.6-2.4 6.6-2.4z"
        fill="#fff"
      />
    </svg>
  );
}
