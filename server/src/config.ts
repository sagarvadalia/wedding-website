/**
 * RSVP deadline: after this date (inclusive of the day), RSVP form is read-only.
 * Set RSVP_BY_DATE in env as ISO date (e.g. 2027-03-01). Omit or leave empty for no deadline.
 */
export function getRsvpByDate(): Date | null {
  const raw = process.env.RSVP_BY_DATE;
  if (!raw?.trim()) return null;
  const date = new Date(raw.trim());
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isRsvpOpen(): boolean {
  const by = getRsvpByDate();
  if (!by) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  by.setHours(0, 0, 0, 0);
  return today <= by;
}
