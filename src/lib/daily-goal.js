// Today's goal: one thing to get done today, written by the user and ticked off when done. It belongs to one day
// (an epoch day) and is simply not shown the next day. The newest edit wins when two copies disagree. The same
// rules and stored text as the desktop and Android apps.

export const GOAL_MAX_LENGTH = 80;

export function parseGoal(value) {
  let raw = value;
  if (typeof value === "string") {
    try {
      raw = JSON.parse(value);
    } catch {
      return null;
    }
  }
  if (!raw || typeof raw !== "object" || !Number.isFinite(raw.d) || typeof raw.t !== "string") return null;
  return {
    d: raw.d,
    t: raw.t.slice(0, GOAL_MAX_LENGTH),
    done: raw.done === true,
    u: Number.isFinite(raw.u) ? raw.u : 0,
  };
}

// The goal that counts for `today`, or null when there is none (or it is from another day).
export function goalFor(goal, today) {
  return goal && goal.d === today && goal.t.trim() !== "" ? goal : null;
}

// The newer of two copies.
export function mergeGoal(a, b) {
  if (!a) return b ?? null;
  if (!b) return a;
  return b.u > a.u ? b : a;
}

export function writeGoal(today, text, done, now) {
  return { d: today, t: text.slice(0, GOAL_MAX_LENGTH), done, u: now };
}
