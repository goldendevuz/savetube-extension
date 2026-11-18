// When the user watches: this browser's playing time by day and hour of day, for the last 28 days, in the same text
// form as the desktop and Android apps. It is kept in this browser only.

export const HOURS_KEEP_DAYS = 28;

// { "<epoch day>": [24 amounts of ms, one for each hour of the day] }
export function parseHours(value) {
  let raw = value;
  if (typeof value === "string") {
    try {
      raw = JSON.parse(value);
    } catch {
      return {};
    }
  }
  const ledger = {};
  if (!raw || typeof raw !== "object") return ledger;
  for (const [day, hours] of Object.entries(raw)) {
    if (!Array.isArray(hours) || hours.length !== 24) continue;
    ledger[day] = hours.map((ms) => (Number.isFinite(ms) && ms > 0 ? ms : 0));
  }
  return ledger;
}

// `ms` more playing time in `hour` of `day`; days older than the kept window are dropped.
export function addHours(ledger, day, hour, ms) {
  if (!(ms > 0) || hour < 0 || hour > 23) return ledger;
  const next = {};
  for (const [key, hours] of Object.entries(ledger)) {
    if (Number(key) > day - HOURS_KEEP_DAYS) next[key] = hours;
  }
  const hours = [...(next[String(day)] ?? new Array(24).fill(0))];
  hours[hour] += ms;
  next[String(day)] = hours;
  return next;
}

export function summarizeHours(ledger) {
  const byHour = new Array(24).fill(0);
  for (const hours of Object.values(ledger)) hours.forEach((ms, hour) => (byHour[hour] += ms));
  const total = byHour.reduce((sum, ms) => sum + ms, 0);
  return { byHour, total, peakHour: total > 0 ? byHour.indexOf(Math.max(...byHour)) : null };
}
