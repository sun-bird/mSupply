/** Parse a `D/M/YYYY` date string (the format `TenderRow` stores) into a
 *  Date in local time. Returns `null` if the input is malformed. */
export function parseDeadline(value: string): Date | null {
  const parts = value.split('/').map((p) => parseInt(p, 10));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [day, month, year] = parts;
  return new Date(year, month - 1, day);
}

/** Whole-day difference between `deadline` and today. Positive = future. */
export function daysUntil(deadline: Date): number {
  const MS_PER_DAY = 86_400_000;
  const today = new Date();
  const a = Date.UTC(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
  const b = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((a - b) / MS_PER_DAY);
}
