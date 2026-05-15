/**
 * Small decorative SVG vignettes for the landing-page feature cards.
 * Each is a 64x64 scene in the warm theme.
 */
const wrap = (children) => (
  <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="16" fill="var(--accent-soft)" />
    {children}
  </svg>
);

export const ArtNotes = () =>
  wrap(
    <>
      <rect x="20" y="16" width="28" height="34" rx="5" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2.4" />
      <path d="M26 26h16M26 33h16M26 40h10" stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" />
    </>
  );

export const ArtAI = () =>
  wrap(
    <>
      <rect x="20" y="22" width="24" height="20" rx="6" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2.4" />
      <circle cx="28" cy="32" r="3" fill="var(--accent)" />
      <circle cx="36" cy="32" r="3" fill="var(--accent)" />
      <line x1="32" y1="22" x2="32" y2="16" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="32" cy="14" r="3.5" fill="var(--accent)" />
    </>
  );

export const ArtSearch = () =>
  wrap(
    <>
      <circle cx="29" cy="29" r="11" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2.6" />
      <line x1="37" y1="37" x2="46" y2="46" stroke="var(--accent)" strokeWidth="3.2" strokeLinecap="round" />
    </>
  );

export const ArtShare = () =>
  wrap(
    <>
      <circle cx="42" cy="20" r="6" fill="var(--accent)" />
      <circle cx="22" cy="32" r="6" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2.4" />
      <circle cx="42" cy="44" r="6" fill="var(--accent)" />
      <path d="M27 29l10-6M27 35l10 6" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" />
    </>
  );

export const ArtTags = () =>
  wrap(
    <>
      <path d="M40 18H24a4 4 0 0 0-4 4v8l14 14 14-14V22a4 4 0 0 0-4-4z"
        fill="var(--surface)" stroke="var(--accent)" strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx="29" cy="27" r="3" fill="var(--accent)" />
    </>
  );

export const ArtInsights = () =>
  wrap(
    <>
      <path d="M18 44V20" stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M18 44h28" stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" />
      <rect x="24" y="32" width="6" height="10" rx="2" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2.2" />
      <rect x="34" y="24" width="6" height="18" rx="2" fill="var(--accent)" />
    </>
  );
