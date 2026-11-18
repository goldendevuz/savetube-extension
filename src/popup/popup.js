import { api } from "../lib/browser.js";
import { bindSettingToggles } from "../lib/bind-settings.js";
import { findRunning } from "../bridge/ping.js";
import { hasBridgePermission, requestBridgePermission } from "../lib/permissions.js";
import { SAVETUBE_RELEASE_URL } from "../lib/const.js";
import { initI18n, applyTranslations, t } from "../lib/i18n.js";
import { localEpochDay, rollover, validMinutes } from "../lib/daily-limit.js";
import { loadTally } from "../lib/daily-tally.js";
import { currentStreak } from "../lib/limit-streak.js";
import { loadStreak } from "../lib/streak-store.js";
import { formatDuration } from "../lib/format-duration.js";

const statusEl = document.getElementById("status");

document.getElementById("version").textContent = `v${api.runtime.getManifest().version}`;

function setStatus(kind, text) {
  statusEl.className = `status status--${kind}`;
  statusEl.textContent = text;
}

async function refreshStatus(settings) {
  if (!(await hasBridgePermission())) {
    setStatus("unknown", t("Enable silent mode"));
    return;
  }
  setStatus("unknown", t("Checking…"));
  const running = await findRunning(settings.ports);
  if (running)
    setStatus(
      "ok",
      running.version ? t("Connected · v%s", running.version) : t("Connected"),
    );
  else setStatus("off", t("Not running"));
}

document.getElementById("get-savetube").href = SAVETUBE_RELEASE_URL;
document.getElementById("open-options").addEventListener("click", () => {
  api.runtime.openOptionsPage();
});

(async () => {
  await initI18n();
  applyTranslations();
  const settings = await bindSettingToggles(document, {
    silentMode: {
      onEnable: async () =>
        (await hasBridgePermission()) ? true : requestBridgePermission(),
      onChange: refreshStatus,
    },
  });
  refreshStatus(settings);

  if (settings.dailyLimit) {
    const tally = rollover(await loadTally(), localEpochDay(Date.now()));
    const line = document.getElementById("limit-line");
    line.textContent = t(
      "Today: %s of %s",
      formatDuration(tally.playedMs),
      formatDuration(validMinutes(settings.dailyLimitMinutes) * 60_000 + tally.extraMs),
    );
    line.hidden = false;

    const streak = currentStreak(await loadStreak(), localEpochDay(Date.now()));
    const streakLine = document.getElementById("streak-line");
    streakLine.textContent = t("Streak: %s days", streak);
    streakLine.hidden = false;
  }
})();
