// The streak: how many days in a row the daily limit held, the same rules and the same stored text as the
// desktop and Android apps. Only the days it broke are remembered (a day is broken once the limit ran out or
// "Keep watching" was used); every other day since the streak began is a good one, also a day nothing was played.

export const MILESTONES = [3, 7, 14, 30, 60, 100, 200, 365];
const KEEP_BROKEN = 120;

const byNewest = (a, b) => b - a;
const unique = (days) => [...new Set(days)];

// { s: first day, b: broken days newest first, best, a: highest milestone announced }
export function parseStreak(value) {
  let raw = value;
  if (typeof value === "string") {
    try {
      raw = JSON.parse(value);
    } catch {
      return null;
    }
  }
  if (!raw || typeof raw !== "object" || !Number.isFinite(raw.s)) return null;
  const broken = Array.isArray(raw.b) ? raw.b.filter(Number.isFinite) : [];
  return {
    s: raw.s,
    b: unique(broken).sort(byNewest).slice(0, KEEP_BROKEN),
    best: raw.best > 0 ? raw.best : 0,
    a: raw.a > 0 ? raw.a : 0,
  };
}

export function mergeStreak(a, b) {
  if (!a) return b ?? null;
  if (!b) return a;
  return {
    s: Math.min(a.s, b.s),
    b: unique([...a.b, ...b.b]).sort(byNewest).slice(0, KEEP_BROKEN),
    best: Math.max(a.best, b.best),
    a: Math.max(a.a, b.a),
  };
}

// The streak on `today`, in days: the days since the last broken one, today included. A broken today is zero.
export function currentStreak(streak, today) {
  if (!streak) return 0;
  const lastBroken = streak.b[0] ?? streak.s - 1;
  return lastBroken >= today ? 0 : today - lastBroken;
}

function same(a, b) {
  return (
    !!b &&
    a.s === b.s &&
    a.best === b.best &&
    a.a === b.a &&
    a.b.length === b.b.length &&
    a.b.every((day, i) => day === b.b[i])
  );
}

// The record after `today` was seen: started if it was new, today marked broken when `exceeded`, the best raised.
// The same object comes back when nothing changed, so the caller can skip saving.
export function recordDay(streak, today, exceeded) {
  let next = streak ?? { s: today, b: [], best: 0, a: 0 };
  if (exceeded && !next.b.includes(today)) {
    // the run that ends today still counts for the best, also when the browser was closed on those days
    const before = currentStreak(next, today - 1);
    next = {
      ...next,
      best: Math.max(next.best, before),
      b: [today, ...next.b].sort(byNewest).slice(0, KEEP_BROKEN),
    };
  }
  const days = currentStreak(next, today);
  if (days > next.best) next = { ...next, best: days };
  return same(next, streak) ? streak : next;
}

// The milestone reached today that was not announced yet, if any.
export function newMilestone(streak, today) {
  if (!streak) return null;
  const days = currentStreak(streak, today);
  const reached = MILESTONES.filter((m) => m <= days && m > streak.a);
  return reached.length ? reached[reached.length - 1] : null;
}

// The next milestone after `days`, or null once all are reached.
export function nextMilestone(days) {
  return MILESTONES.find((m) => m > days) ?? null;
}
