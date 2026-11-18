import { api } from "./browser.js";
import { mergeStreak, parseStreak } from "./limit-streak.js";

// The streak is kept in the browser's synced storage, so every browser signed in to the same account shows it.
const KEY = "limitStreak";

export async function loadStreak() {
  const stored = await api.storage.sync.get(KEY);
  return parseStreak(stored?.[KEY]);
}

// Merged into what is stored, so a broken day saved from another browser is never lost.
export async function saveStreak(streak) {
  const merged = mergeStreak(await loadStreak(), streak);
  await api.storage.sync.set({ [KEY]: JSON.stringify(merged) });
  return merged;
}
