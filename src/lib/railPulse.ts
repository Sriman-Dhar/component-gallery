/**
 * The hero rail's pulse head (0..1 along the rail, past 1 while its afterglow clears, -1 before the first
 * run). The rail writes it every pulse frame; the orrery reads it in its frame loop to catch the pulse as
 * it leaves the rail's end. A plain mutable value: no React state, no events, nothing per frame to allocate.
 */
export const railPulse = { head: -1 };
