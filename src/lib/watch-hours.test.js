import { test } from "node:test";
import assert from "node:assert/strict";
import { addHours, parseHours, summarizeHours } from "./watch-hours.js";
import { goalFor, mergeGoal, parseGoal, writeGoal } from "./daily-goal.js";

test("adds time to the hour of the day", () => {
  let ledger = addHours({}, 100, 21, 60_000);
  ledger = addHours(ledger, 100, 21, 30_000);
  ledger = addHours(ledger, 101, 8, 10_000);
  assert.equal(ledger["100"][21], 90_000);
  assert.equal(ledger["101"][8], 10_000);
});

test("drops days older than 28", () => {
  const ledger = addHours(addHours({}, 10, 1, 1000), 40, 1, 1000);
  assert.deepEqual(Object.keys(ledger), ["40"]);
});

test("finds the peak hour over all days", () => {
  let ledger = addHours({}, 1, 9, 5000);
  ledger = addHours(ledger, 2, 22, 4000);
  ledger = addHours(ledger, 3, 22, 4000);
  const summary = summarizeHours(ledger);
  assert.equal(summary.peakHour, 22);
  assert.equal(summary.total, 13000);
  assert.equal(summarizeHours({}).peakHour, null);
});

test("hours ignore junk", () => {
  assert.deepEqual(parseHours("nope"), {});
  assert.deepEqual(parseHours('{"5":[1,2]}'), {});
});

test("shows only today's goal", () => {
  const goal = writeGoal(50, "Finish the course video", false, 1000);
  assert.equal(goalFor(goal, 50).t, "Finish the course video");
  assert.equal(goalFor(goal, 51), null);
  assert.equal(goalFor(writeGoal(50, "   ", false, 1), 50), null);
});

test("keeps the newer goal copy", () => {
  const older = writeGoal(50, "a", false, 100);
  const newer = writeGoal(50, "a", true, 200);
  assert.equal(mergeGoal(older, newer), newer);
  assert.equal(mergeGoal(newer, older), newer);
  assert.equal(mergeGoal(null, older), older);
});

test("limits the goal length and reads the apps' text", () => {
  assert.equal(writeGoal(1, "x".repeat(200), false, 1).t.length, 80);
  assert.deepEqual(parseGoal('{"d":7,"t":"Read","done":true,"u":9}'), { d: 7, t: "Read", done: true, u: 9 });
  assert.equal(parseGoal("nope"), null);
});
