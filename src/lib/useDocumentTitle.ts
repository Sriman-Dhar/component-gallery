import { useEffect } from 'react';
import { SITE_NAME } from './site';

/** "Page · Sriman's Gallery", or the bare site name for the index. Set on every route change. */
export function pageTitle(page?: string): string {
  return page ? `${page} · ${SITE_NAME}` : SITE_NAME;
}

export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
