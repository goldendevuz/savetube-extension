import { MUSIC_HOST } from "../lib/const.js";
import {
  addPlayed,
  extend,
  isUsedUp,
  localEpochDay,
  remainingMs,
  rollover,
  shouldWarn,
  validMinutes,
} from "../lib/daily-limit.js";
import { loadTally, saveTally, onTallyChanged } from "../lib/daily-tally.js";
import { t } from "../lib/i18n.js";
import { toast } from "../ui/toast.js";
import { isLimitDialogShown, showLimitDialog } from "../ui/limit-dialog.js";

const TICK_MS = 1000;
// A longer gap between ticks means the computer slept: that time was not spent watching.
const MAX_COUNTED_GAP_MS = 3000;
// The count is saved this often while it changes, and at once when something happens.
const FLUSH_EVERY_MS = 10_000;
const PREVIEW_SELECTOR =
  "ytd-video-preview, ytd-thumbnail, yt-thumbnail-view-model, ytd-moving-thumbnail-renderer";

// The videos that count: the player and the Shorts, not the small previews that play when a card is hovered.
function playerVideos() {
  return [...document.querySelectorAll("video")].filter(
    (video) => !video.closest(PREVIEW_SELECTOR),
  );
}

function somethingPlays(settings) {
  if (location.host === MUSIC_HOST && !settings.dailyLimitMusic) return false;
  return playerVideos().some(
    (video) => !video.paused && !video.ended && video.readyState > 2,
  );
}

function pauseAll() {
  for (const video of playerVideos()) {
    if (!video.paused) video.pause();
  }
}

// Counts the time videos play in this browser on the local day, warns five minutes before the end, and pauses
// everything when the time is up. Several tabs add their own time to the same saved count.
export function startDailyLimit(getSettings) {
  let tally = null;
  let loaded = false;
  let pendingMs = 0;
  let dirty = false;
  let lastFlush = 0;
  let last = Date.now();
  let busy = false;

  loadTally().then((stored) => {
    tally = stored;
    loaded = true;
  });
  onTallyChanged((stored) => {
    if (stored) tally = stored;
  });

  // Adds what this tab counted to the saved count, keeping what other tabs saved meanwhile.
  async function flush(view, now) {
    const stored = rollover(await loadTally(), localEpochDay(now));
    const next = {
      ...addPlayed(stored, pendingMs),
      warned: stored.warned || view.warned,
      reached: stored.reached || view.reached,
      extraMs: Math.max(stored.extraMs, view.extraMs),
    };
    await saveTally(next);
    tally = next;
    pendingMs = 0;
    dirty = false;
    lastFlush = now;
  }

  async function keepWatching() {
    const settings = getSettings();
    const minutes = validMinutes(settings.dailyLimitMinutes);
    const now = Date.now();
    const stored = rollover(await loadTally(), localEpochDay(now));
    const next = extend(minutes, addPlayed(stored, pendingMs));
    await saveTally(next);
    tally = next;
    pendingMs = 0;
    dirty = false;
    lastFlush = now;
  }

  async function tick() {
    const now = Date.now();
    const elapsed = Math.min(now - last, MAX_COUNTED_GAP_MS);
    last = now;
    const settings = getSettings();
    if (!settings.dailyLimit) {
      pendingMs = 0;
      dirty = false;
      return;
    }
    if (!loaded) return;

    const minutes = validMinutes(settings.dailyLimitMinutes);
    const base = rollover(tally, localEpochDay(now));
    if (base !== tally) {
      tally = base;
      pendingMs = 0;
      dirty = true;
    }

    const playing = somethingPlays(settings);
    if (playing) {
      pendingMs += elapsed;
      dirty = true;
    }

    let view = addPlayed(tally, pendingMs);
    let urgent = false;
    if (shouldWarn(minutes, view)) {
      view = { ...view, warned: true };
      urgent = true;
      toast({ message: t("5 minutes left today"), duration: 8000 });
    }
    if (playing && isUsedUp(minutes, view)) {
      view = { ...view, reached: true };
      urgent = true;
      pauseAll();
      if (!isLimitDialogShown()) {
        showLimitDialog({
          playedMs: view.playedMs,
          limitMs: minutes * 60_000,
          onKeepWatching: keepWatching,
        });
      }
    }

    if (urgent || (dirty && now - lastFlush >= FLUSH_EVERY_MS)) await flush(view, now);
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

  return {
    remainingMs: () =>
      tally ? remainingMs(validMinutes(getSettings().dailyLimitMinutes), tally) : null,
  };
}
