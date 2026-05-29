export function secondsUntil(deadlineEpochMs: number, now = Date.now()): number {
  return Math.max(0, Math.ceil((deadlineEpochMs - now) / 1_000));
}
