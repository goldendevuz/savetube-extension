// The daily limit, the same rules as the SaveTube desktop and Android apps: playing time is counted on one
// local day, a warning goes out five minutes before the end, and "Keep watching" adds fifteen minutes.

export const MIN_MINUTES = 15;
export const MAX_MINUTES = 8 * 60;
export const STEP_MINUTES = 15;
export const DEFAULT_MINUTES = 2 * 60;
export const EXTENSION_MS = 15 * 60_000;
export const WARNING_MS = 5 * 60_000;
// Turning the limit off or lowering it after it ran out waits this long first.
export const WAIT_MS = 30_000;

const MS_PER_MINUTE = 60_000;
const MS_PER_DAY = 86_400_000;

export const MINUTE_CHOICES = Array.from(
  { length: (MAX_MINUTES - MIN_MINUTES) / STEP_MINUTES + 1 },
  (_, index) => MIN_MINUTES + index * STEP_MINUTES,
);

// The local calendar day of a moment, as a number of days.
export function localEpochDay(ms) {
  return Math.floor((ms - new Date(ms).getTimezoneOffset() * MS_PER_MINUTE) / MS_PER_DAY);
}

// `minutes` if it is one of the choices, otherwise the default.
export function validMinutes(minutes) {
  return MINUTE_CHOICES.includes(minutes) ? minutes : DEFAULT_MINUTES;
}

export function emptyTally(day) {
  return { day, playedMs: 0, extraMs: 0, warned: false, reached: false };
}

// A stored value read back as a tally, or null when it is missing or damaged.
export function readTally(value) {
  if (!value || typeof value.day !== "number" || typeof value.playedMs !== "number")
    return null;
  return {
    day: value.day,
    playedMs: Math.max(0, value.playedMs),
    extraMs: Math.max(0, Number(value.extraMs ?? 0)),
    warned: value.warned === true,
    reached: value.reached === true,
  };
}

// The tally to count on for `today`. A later day starts from nothing. An earlier one means the clock was moved
// back, so the stored day carries on rather than handing out a fresh day.
export function rollover(tally, today) {
  return !tally || today > tally.day ? emptyTally(today) : tally;
}

export function addPlayed(tally, playedMs) {
  return { ...tally, playedMs: tally.playedMs + Math.max(0, playedMs) };
}

export function allowanceMs(minutes, tally) {
  return minutes * MS_PER_MINUTE + tally.extraMs;
}

export function remainingMs(minutes, tally) {
  return Math.max(0, allowanceMs(minutes, tally) - tally.playedMs);
}

export function isUsedUp(minutes, tally) {
  return remainingMs(minutes, tally) === 0;
}

// True once per day, when the time left first drops to the warning and the limit has not run out yet.
export function shouldWarn(minutes, tally) {
  const remaining = remainingMs(minutes, tally);
  return !tally.warned && remaining > 0 && remaining <= WARNING_MS;
}

// Exactly EXTENSION_MS more from now, also when playing ran past the limit. `reached` and `warned` stay as they
// are: the limit did run out today, so turning it off still waits, and the warning goes out once a day.
export function extend(minutes, tally) {
  const overrunMs = Math.max(0, tally.playedMs - allowanceMs(minutes, tally));
  return { ...tally, extraMs: tally.extraMs + overrunMs + EXTENSION_MS };
}

// Turning the limit off or lowering it after it ran out today waits first. Raising it does not.
export function changeNeedsWait(current, next, tally, today) {
  const ranOutToday = !!tally && tally.reached && today <= tally.day;
  if (!ranOutToday || !current.enabled) return false;
  return (
    !next.enabled ||
    next.minutes < current.minutes ||
    (current.countMusic && !next.countMusic)
  );
}
