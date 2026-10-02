/**
 * Site-wide settings in one place. The repo has no public URL yet: while REPO_URL is null the header
 * and footer show a plain "coming soon" note instead of a dead link. Publishing it is this one edit.
 */
export const REPO_URL: string | null = 'https://github.com/Sriman-Dhar/component-gallery';

/** The plain name: document titles, the meta tags and every accessible name read this exact string. */
export const SITE_NAME = "Sriman's Gallery";

/** The hero splits the name in two voices: the signature (script, amber) and the title word (wide sans). */
export const SIGNATURE = 'Sriman';
export const TITLE_WORD = 'Gallery';

/** The one pace line: footer and the meta description in index.html say exactly this. */
export const PACE_LINE = 'Thirty components in thirteen weeks.';


/**
 * Display typesetting: the straight apostrophe becomes the typographic one (U+2019) wherever the display face
 * sets it on screen. Titles, meta and accessible names keep the plain string, so search and tests match.
 */
export function typeset(text: string): string {
  return text.replace(/'/g, '’');
}
