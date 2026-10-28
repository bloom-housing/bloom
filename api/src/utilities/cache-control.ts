// Shared Cache-Control for public, edge-cacheable reads that change only on an admin edit.
// The durations are tunable per environment via PUBLIC_CACHE_S_MAXAGE and
// PUBLIC_CACHE_STALE_WHILE_REVALIDATE (seconds); other public read controllers can reuse this.
function envInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const sMaxAge = envInt(process.env.PUBLIC_CACHE_S_MAXAGE, 300);
const staleWhileRevalidate = envInt(
  process.env.PUBLIC_CACHE_STALE_WHILE_REVALIDATE,
  600,
);

export const PUBLIC_CACHE_CONTROL = `public, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`;
