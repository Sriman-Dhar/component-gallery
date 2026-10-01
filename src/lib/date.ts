/** One date style for the whole site: "25 Sep 2026", or "25 Sep" without the year. */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

/** Formats an ISO date (YYYY-MM-DD) without touching time zones: the calendar day as written. */
export function formatDate(iso: string, { year = true }: { year?: boolean } = {}): string {
  const [y, m, d] = iso.split('-').map(Number);
  return year ? `${d} ${MONTHS[m - 1]} ${y}` : `${d} ${MONTHS[m - 1]}`;
}
