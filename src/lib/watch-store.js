import { api } from "./browser.js";
import { mergeGoal, parseGoal } from "./daily-goal.js";
import { addHours, parseHours } from "./watch-hours.js";

const GOAL_KEY = "dailyGoal";
const HOURS_KEY = "watchHours";
const SESSION_KEY = "watchSession";

// Today's goal is synced with the browser account, like the settings.
export async function loadGoal() {
  const stored = await api.storage.sync.get(GOAL_KEY);
  return parseGoal(stored?.[GOAL_KEY]);
}

export async function saveGoal(goal) {
  const merged = mergeGoal(await loadGoal(), goal);
  await api.storage.sync.set({ [GOAL_KEY]: JSON.stringify(merged) });
  return merged;
}

// Playing time by hour of day stays in this browser.
export async function loadHours() {
  const stored = await api.storage.local.get(HOURS_KEY);
  return parseHours(stored?.[HOURS_KEY]);
}

export async function addPlayedHours(entries) {
  if (!entries.length) return;
  let ledger = await loadHours();
  for (const { day, hour, ms } of entries) ledger = addHours(ledger, day, hour, ms);
  await api.storage.local.set({ [HOURS_KEY]: JSON.stringify(ledger) });
}

// The current session (playing since the last break of five minutes), shared by the tabs.
export async function loadSession() {
  const stored = (await api.storage.local.get(SESSION_KEY))?.[SESSION_KEY];
  return stored && Number.isFinite(stored.ms) && Number.isFinite(stored.last)
    ? { ms: stored.ms, last: stored.last }
    : { ms: 0, last: 0 };
}

export async function saveSession(session) {
  await api.storage.local.set({ [SESSION_KEY]: session });
}
