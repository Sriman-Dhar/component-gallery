/** Recent command ids, newest first. Storage can throw (private mode, blocked site data): memory carries on then. */
export interface RecentStore {
  read: () => string[];
  push: (id: string) => string[];
  clear: () => void;
}

/** Per-key fallback, so a store keeps working for the whole session when localStorage is unavailable. */
const memory = new Map<string, string[]>();

function storage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

function parse(raw: string | null): string[] | null {
  if (raw === null) return null;
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : null;
  } catch {
    return null;
  }
}

export function createRecentStore(key = 'command-palette:recent', max = 5): RecentStore {
  const limit = Math.max(1, Math.floor(max));

  const read = (): string[] => {
    try {
      const stored = parse(storage()?.getItem(key) ?? null);
      if (stored) return stored.slice(0, limit);
    } catch {
      // fall through to memory
    }
    return (memory.get(key) ?? []).slice(0, limit);
  };

  const write = (ids: string[]) => {
    memory.set(key, ids);
    try {
      storage()?.setItem(key, JSON.stringify(ids));
    } catch {
      // memory already holds it
    }
  };

  return {
    read,
    push: (id) => {
      const next = [id, ...read().filter((x) => x !== id)].slice(0, limit);
      write(next);
      return next;
    },
    clear: () => {
      memory.set(key, []);
      try {
        storage()?.removeItem(key);
      } catch {
        // memory already cleared
      }
    },
  };
}
