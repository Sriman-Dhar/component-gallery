/** Opt in to React Router v7 behavior now, so the upgrade is a no-op and tests stay quiet. */
export const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true } as const;
