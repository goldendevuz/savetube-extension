import { api } from "./browser.js";
import { readTally } from "./daily-limit.js";

// Today's running count lives in this browser only (storage.local); the limit settings sync like the others.
const KEY = "dailyTally";

export async function loadTally() {
  const stored = await api.storage.local.get(KEY);
  return readTally(stored?.[KEY]);
}

export async function saveTally(tally) {
  await api.storage.local.set({ [KEY]: tally });
}

export function onTallyChanged(callback) {
  const handler = (changes, area) => {
    if (area === "local" && changes[KEY]) callback(readTally(changes[KEY].newValue));
  };
  api.storage.onChanged.addListener(handler);
  return () => api.storage.onChanged.removeListener(handler);
}
