import { test } from "node:test";
import assert from "node:assert/strict";
import {
  currentStreak,
  mergeStreak,
  newMilestone,
  nextMilestone,
  parseStreak,
  recordDay,
} from "./limit-streak.js";

test("starts at one day and grows with every day without a break", () => {
  const first = recordDay(null, 100, false);
  assert.equal(currentStreak(first, 100), 1);
  assert.equal(currentStreak(first, 104), 5);
});

test("a day nothing was played is a good day", () => {
  assert.equal(currentStreak(recordDay(null, 10, false), 20), 11);
});

test("resets on the day the limit breaks and starts again the day after", () => {
  let s = recordDay(null, 10, false);
  s = recordDay(s, 14, true);
  assert.equal(currentStreak(s, 14), 0);
  assert.equal(currentStreak(s, 15), 1);
  assert.equal(s.best, 4);
});

test("keeps the best streak after a break", () => {
  let s = recordDay(null, 1, false);
  s = recordDay(s, 8, false);
  s = recordDay(s, 8, true);
  assert.equal(s.best, 8);
  assert.equal(currentStreak(s, 9), 1);
});

test("returns the same record when nothing changed", () => {
  const s = recordDay(null, 5, false);
  assert.equal(recordDay(s, 5, false), s);
});

test("merges two copies without forgetting a broken day", () => {
  const a = { s: 5, b: [20], best: 4, a: 3 };
  const b = { s: 3, b: [25, 20], best: 9, a: 7 };
  assert.deepEqual(mergeStreak(a, b), { s: 3, b: [25, 20], best: 9, a: 7 });
  assert.equal(mergeStreak(null, a), a);
});

test("announces a milestone once", () => {
  let s = recordDay(null, 1, false);
  assert.equal(newMilestone(s, 2), null);
  assert.equal(newMilestone(s, 3), 3);
  s = { ...s, a: 3 };
  assert.equal(newMilestone(s, 3), null);
  assert.equal(newMilestone(s, 7), 7);
});

test("knows the next milestone", () => {
  assert.equal(nextMilestone(0), 3);
  assert.equal(nextMilestone(7), 14);
  assert.equal(nextMilestone(400), null);
});

test("reads the text the apps write and rejects junk", () => {
  assert.deepEqual(parseStreak('{"s":120,"b":[125,130],"best":9,"a":7}'), {
    s: 120,
    b: [130, 125],
    best: 9,
    a: 7,
  });
  assert.equal(parseStreak("nope"), null);
  assert.equal(parseStreak(""), null);
});
