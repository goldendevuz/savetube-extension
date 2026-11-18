import { localEpochDay } from "../lib/daily-limit.js";
import { loadSession, saveSession, addPlayedHours } from "../lib/watch-store.js";
import { t } from "../lib/i18n.js";

const TICK_MS = 1000;
// A longer gap between ticks means the computer slept: that time was not spent watching.
const MAX_COUNTED_GAP_MS = 3000;
const SAVE_EVERY_MS = 30_000;
// Not playing for this long ends the session.
const BREAK_MS = 5 * 60_000;
const PREVIEW_SELECTOR =
  "ytd-video-preview, ytd-thumbnail, yt-thumbnail-view-model, ytd-moving-thumbnail-renderer";

function somethingPlays() {
  return [...document.querySelectorAll("video")]
    .filter((video) => !video.closest(PREVIEW_SELECTOR))
    .some((video) => !video.paused && !video.ended && video.readyState > 2);
}

let chip;

// A small "Session 23 min" label next to the time in the player, once the session is a minute or more.
function showSession(minutes) {
  const host = document.querySelector(".ytp-left-controls");
  if (!host || minutes < 1) {
    chip?.remove();
    return;
  }
  if (!chip || !chip.isConnected) {
    chip = document.createElement("span");
    chip.className = "savetube-session";
    chip.style.cssText =
      "align-self:center;margin-left:10px;padding:2px 8px;border-radius:99px;font-size:12px;line-height:18px;color:#fff;background:rgba(0,0,0,.35);opacity:.9;white-space:nowrap;pointer-events:none";
    host.appendChild(chip);
  }
  const text = t("Session %s min", minutes);
  if (chip.textContent !== text) chip.textContent = text;
}

// Follows the playing time in this browser: the hour of the day it falls in (for the "When you watch" card on the
// options page) and the current session (for the label in the player).
export function startWatchTracking() {
  let session = { ms: 0, last: 0 };
  let pending = [];
  let last = Date.now();
  let lastSaved = last;
  let loaded = false;
  let busy = false;

  loadSession().then((stored) => {
    session = stored;
    loaded = true;
  });

  async function tick() {
    const now = Date.now();
    const elapsed = Math.min(now - last, MAX_COUNTED_GAP_MS);
    last = now;
    if (!loaded) return;

    if (somethingPlays()) {
      if (now - session.last > BREAK_MS) session = { ms: 0, last: now };
      session = { ms: session.ms + elapsed, last: now };
      const date = new Date(now);
      const day = localEpochDay(now);
      const hour = date.getHours();
      const tail = pending[pending.length - 1];
      if (tail && tail.day === day && tail.hour === hour) tail.ms += elapsed;
      else pending.push({ day, hour, ms: elapsed });
    }
    const idle = now - session.last > BREAK_MS;
    showSession(idle ? 0 : Math.floor(session.ms / 60_000));

    if (now - lastSaved >= SAVE_EVERY_MS && pending.length) {
      lastSaved = now;
      const batch = pending;
      pending = [];
      await addPlayedHours(batch);
      await saveSession(session);
    }
  }

  setInterval(() => {
    if (busy) return;
    busy = true;
    tick()
      .catch(() => {})
      .finally(() => {
        busy = false;
      });
  }, TICK_MS);
}
