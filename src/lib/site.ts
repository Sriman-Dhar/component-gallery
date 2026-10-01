/**
 * Site-wide settings in one place. The repo has no public URL yet: while REPO_URL is null the header
 * and footer show a plain "coming soon" note instead of a dead link. Publishing it is this one edit.
 */
export const REPO_URL: string | null = null;

/** The plain name: document titles, the meta tags and every accessible name read this exact string. */
export const SITE_NAME = "Sriman's Gallery";

/** The one pace line: footer and the meta description in index.html say exactly this. */
export const PACE_LINE = 'Thirty components in thirteen weeks.';

/** The hero sets the pace line as the italic accent that continues the name, so it starts lower case. */
export const PACE_ACCENT = PACE_LINE.charAt(0).toLowerCase() + PACE_LINE.slice(1);

/**
 * Display typesetting: the straight apostrophe becomes the typographic one (U+2019) wherever the display face
 * sets it on screen. Titles, meta and accessible names keep the plain string, so search and tests match.
 */
export function typeset(text: string): string {
  return text.replace(/'/g, '’');
}
