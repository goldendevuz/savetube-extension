import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_MINUTES,
  EXTENSION_MS,
  MINUTE_CHOICES,
  WARNING_MS,
  addPlayed,
  allowanceMs,
  changeNeedsWait,
  emptyTally,
  extend,
  isUsedUp,
  localEpochDay,
  readTally,
  remainingMs,
  rollover,
  shouldWarn,
  validMinutes,
} from "./daily-limit.js";

const MIN = 60_000;
const on = { enabled: true, minutes: 120, countMusic: false };

test("the minute choices run from 15 minutes to 8 hours in steps of 15", () => {
  assert.equal(MINUTE_CHOICES[0], 15);
  assert.equal(MINUTE_CHOICES[1], 30);
  assert.equal(MINUTE_CHOICES[MINUTE_CHOICES.length - 1], 480);
  assert.equal(MINUTE_CHOICES.length, 32);
  assert.equal(validMinutes(45), 45);
  assert.equal(validMinutes(50), DEFAULT_MINUTES);
  assert.equal(validMinutes(undefined), 120);
});

test("the day changes at local midnight", () => {
  const noon = new Date(2026, 10, 15, 12, 0).getTime();
  assert.equal(
    localEpochDay(new Date(2026, 10, 16, 12, 0).getTime()) - localEpochDay(noon),
    1,
  );
  assert.equal(
    localEpochDay(new Date(2026, 10, 15, 23, 59).getTime()),
    localEpochDay(noon),
  );
});

test("a later day starts from nothing, an earlier one carries on", () => {
  const tally = { ...emptyTally(100), playedMs: 5 * MIN, reached: true };
  assert.deepEqual(rollover(null, 100), emptyTally(100));
  assert.equal(rollover(tally, 100), tally);
  assert.deepEqual(rollover(tally, 101), emptyTally(101));
  assert.equal(rollover(tally, 99), tally);
});

test("a stored tally is read back, and a damaged one is not", () => {
  assert.equal(readTally(null), null);
  assert.equal(readTally({ day: "x" }), null);
  assert.deepEqual(readTally({ day: 4, playedMs: 10 }), {
    day: 4,
    playedMs: 10,
    extraMs: 0,
    warned: false,
    reached: false,
  });
});

test("time left", () => {
  const tally = addPlayed(emptyTally(1), 100 * MIN);
  assert.equal(allowanceMs(120, tally), 120 * MIN);
  assert.equal(remainingMs(120, tally), 20 * MIN);
  assert.equal(addPlayed(tally, -5 * MIN).playedMs, 100 * MIN);
  assert.equal(isUsedUp(120, addPlayed(tally, 50 * MIN)), true);
  assert.equal(isUsedUp(120, tally), false);
});

test("the warning is due once, in the last five minutes", () => {
  assert.equal(shouldWarn(120, addPlayed(emptyTally(1), 110 * MIN)), false);
  const inside = addPlayed(emptyTally(1), 115 * MIN);
  assert.equal(remainingMs(120, inside), WARNING_MS);
  assert.equal(shouldWarn(120, inside), true);
  assert.equal(shouldWarn(120, { ...inside, warned: true }), false);
  assert.equal(shouldWarn(120, addPlayed(emptyTally(1), 120 * MIN)), false);
});

test("keep watching adds exactly fifteen minutes, also after running past the limit", () => {
  assert.equal(
    remainingMs(120, extend(120, addPlayed(emptyTally(1), 120 * MIN))),
    EXTENSION_MS,
  );
  assert.equal(
    remainingMs(120, extend(120, addPlayed(emptyTally(1), 130 * MIN))),
    EXTENSION_MS,
  );
  const next = extend(120, {
    ...addPlayed(emptyTally(1), 120 * MIN),
    reached: true,
    warned: true,
  });
  assert.equal(next.reached, true);
  assert.equal(next.warned, true);
});

test("changing the limit after it ran out waits only for turning it off or lowering it", () => {
  const ranOut = { ...emptyTally(10), reached: true };
  assert.equal(changeNeedsWait(on, { ...on, enabled: false }, ranOut, 10), true);
  assert.equal(changeNeedsWait(on, { ...on, minutes: 90 }, ranOut, 10), true);
  assert.equal(changeNeedsWait({ ...on, countMusic: true }, on, ranOut, 10), true);
  assert.equal(changeNeedsWait(on, { ...on, minutes: 180 }, ranOut, 10), false);
  assert.equal(changeNeedsWait(on, { ...on, countMusic: true }, ranOut, 10), false);
  assert.equal(changeNeedsWait(on, { ...on, enabled: false }, emptyTally(10), 10), false);
  assert.equal(changeNeedsWait(on, { ...on, enabled: false }, null, 10), false);
  assert.equal(
    changeNeedsWait({ ...on, enabled: false }, { ...on, minutes: 30 }, ranOut, 10),
    false,
  );
  assert.equal(changeNeedsWait(on, { ...on, enabled: false }, ranOut, 11), false);
});
