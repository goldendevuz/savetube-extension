import { api } from "../lib/browser.js";
import { bindSettingToggles } from "../lib/bind-settings.js";
import { loadSettings, saveSettings, DEFAULT_SETTINGS } from "../lib/settings.js";
import { hasBridgePermission, requestBridgePermission } from "../lib/permissions.js";
import { SAVETUBE_RELEASE_URL, EXTENSION_REPO_URL } from "../lib/const.js";
import { LANGUAGES, initI18n, applyTranslations, t } from "../lib/i18n.js";
import {
  MINUTE_CHOICES,
  WAIT_MS,
  changeNeedsWait,
  localEpochDay,
  validMinutes,
} from "../lib/daily-limit.js";
import { loadTally } from "../lib/daily-tally.js";
import { MILESTONES, currentStreak, nextMilestone } from "../lib/limit-streak.js";
import { loadStreak } from "../lib/streak-store.js";
import { GOAL_MAX_LENGTH, goalFor, writeGoal } from "../lib/daily-goal.js";
import { summarizeHours } from "../lib/watch-hours.js";
import { loadGoal, saveGoal, loadHours } from "../lib/watch-store.js";
import { formatDuration } from "../lib/format-duration.js";

const grantBtn = document.getElementById("grant");
const portsInput = document.getElementById("ports");

document.getElementById("version").textContent = `v${api.runtime.getManifest().version}`;

async function refreshGrant() {
  const granted = await hasBridgePermission();
  grantBtn.textContent = granted ? t("Access granted") : t("Grant access");
  grantBtn.disabled = granted;
}

function parsePorts(value) {
  const ports = value
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => Number.isInteger(n) && n > 0 && n < 65536);
  return ports.length ? ports : DEFAULT_SETTINGS.ports;
}

grantBtn.addEventListener("click", async () => {
  await requestBridgePermission();
  refreshGrant();
});

portsInput.addEventListener("change", async () => {
  const ports = parsePorts(portsInput.value);
  portsInput.value = ports.join(", ");
  await saveSettings({ ports });
});

document.getElementById("get-savetube").href = SAVETUBE_RELEASE_URL;
document.getElementById("repo").href = EXTENSION_REPO_URL;

const languageSelect = document.getElementById("language");

function fillLanguages(chosen) {
  languageSelect.replaceChildren(
    new Option(t("Automatic"), "auto"),
    ...LANGUAGES.map(({ code, label }) => new Option(label, code)),
  );
  languageSelect.value = chosen;
}

languageSelect.addEventListener("change", async () => {
  await saveSettings({ language: languageSelect.value });
  location.reload();
});

// The daily limit. Turning it off or lowering it after it ran out today asks for a short wait first.
const limitOn = document.getElementById("daily-limit");
const limitMinutes = document.getElementById("daily-limit-minutes");
const limitMusic = document.getElementById("daily-limit-music");
const limitRows = document.getElementById("daily-limit-rows");
const limitWait = document.getElementById("daily-limit-wait");
const limitConfirm = document.getElementById("daily-limit-confirm");
const limitCancel = document.getElementById("daily-limit-cancel");
let waitTimer;
let pendingLimit = null;

function limitFrom(settings) {
  return {
    enabled: !!settings.dailyLimit,
    minutes: validMinutes(settings.dailyLimitMinutes),
    countMusic: !!settings.dailyLimitMusic,
  };
}

// Today's goal: one line, ticked off when done.
const goalText = document.getElementById("goal-text");
const goalDone = document.getElementById("goal-done");
const goalClear = document.getElementById("goal-clear");

async function renderGoal() {
  const goal = goalFor(await loadGoal(), localEpochDay(Date.now()));
  goalText.placeholder = t("Write today's goal");
  goalText.value = goal?.t ?? "";
  goalText.classList.toggle("is-done", !!goal?.done);
  goalDone.checked = !!goal?.done;
  goalDone.disabled = !goal;
  goalClear.hidden = !goal;
}

async function commitGoal(text, done) {
  const trimmed = text.trim().slice(0, GOAL_MAX_LENGTH);
  await saveGoal(writeGoal(localEpochDay(Date.now()), trimmed, trimmed ? done : false, Date.now()));
  renderGoal();
}

goalText.addEventListener("change", () => commitGoal(goalText.value, goalDone.checked));
goalText.addEventListener("keydown", (event) => event.key === "Enter" && goalText.blur());
goalDone.addEventListener("change", () => commitGoal(goalText.value, goalDone.checked));
goalClear.addEventListener("click", () => commitGoal("", false));

// When you watch: the 24 hours of the day, the bar of each as tall as the time played then, over the last 28 days.
async function renderHours() {
  const { byHour, total, peakHour } = summarizeHours(await loadHours());
  const peak = Math.max(...byHour, 1);
  document.getElementById("hours-peak").textContent =
    peakHour === null
      ? t("Nothing counted yet. It fills in as you watch.")
      : t("Most of your watching happens at %s", `${peakHour}:00–${(peakHour + 1) % 24}:00`);
  document.getElementById("hours-bars").replaceChildren(
    ...byHour.map((ms, hour) => {
      const bar = document.createElement("i");
      bar.title = `${hour}:00 · ${formatDuration(ms)}`;
      bar.className = hour === peakHour ? "is-peak" : "";
      bar.style.height = `${Math.max(4, Math.round((ms / peak) * 100))}%`;
      return bar;
    }),
  );
  document.getElementById("hours-total").textContent =
    total > 0 ? t("%s in this browser in the last 28 days", formatDuration(total)) : "";
}

async function renderStreak() {
  const streak = await loadStreak();
  const days = currentStreak(streak, localEpochDay(Date.now()));
  const best = Math.max(streak?.best ?? 0, days);
  const next = nextMilestone(days);
  const previous = [...MILESTONES].reverse().find((m) => m <= days) ?? 0;
  document.getElementById("streak-days").textContent = String(days);
  document.getElementById("streak-best").textContent = t("Best: %s", best);
  document.getElementById("streak-next").textContent =
    next === null ? t("Every badge earned") : t("Next badge at %s days", next);
  document.getElementById("streak-bar").style.width =
    `${Math.round((next === null ? 1 : (days - previous) / (next - previous)) * 100)}%`;
  document.getElementById("streak-badges").replaceChildren(
    ...MILESTONES.map((m) => {
      const badge = document.createElement("span");
      badge.textContent = String(m);
      badge.className = best >= m ? "badge badge--on" : "badge";
      return badge;
    }),
  );
}

function renderLimit(limit) {
  limitOn.checked = limit.enabled;
  limitMinutes.value = String(limit.minutes);
  limitMusic.checked = limit.countMusic;
  limitRows.hidden = !limit.enabled;
  renderStreak();
  renderGoal();
  renderHours();
}

async function applyLimit(next) {
  await saveSettings({
    dailyLimit: next.enabled,
    dailyLimitMinutes: next.minutes,
    dailyLimitMusic: next.countMusic,
  });
  renderLimit(next);
}

function stopWaiting(current) {
  clearInterval(waitTimer);
  pendingLimit = null;
  limitWait.hidden = true;
  renderLimit(current);
}

function startWaiting(current, next) {
  pendingLimit = next;
  limitWait.hidden = false;
  const readyAt = Date.now() + WAIT_MS;
  const refresh = () => {
    const secondsLeft = Math.max(0, Math.ceil((readyAt - Date.now()) / 1000));
    limitConfirm.disabled = secondsLeft > 0;
    limitConfirm.textContent =
      secondsLeft > 0 ? t("Wait %s s", secondsLeft) : t("Change");
  };
  refresh();
  clearInterval(waitTimer);
  waitTimer = setInterval(refresh, 500);
  limitCancel.onclick = () => stopWaiting(current);
  limitConfirm.onclick = async () => {
    const chosen = pendingLimit;
    stopWaiting(current);
    if (chosen) await applyLimit(chosen);
  };
}

async function requestLimitChange(next) {
  const current = limitFrom(await loadSettings());
  const tally = await loadTally();
  if (changeNeedsWait(current, next, tally, localEpochDay(Date.now())))
    startWaiting(current, next);
  else await applyLimit(next);
}

function readLimitForm() {
  return {
    enabled: limitOn.checked,
    minutes: Number(limitMinutes.value),
    countMusic: limitMusic.checked,
  };
}

for (const control of [limitOn, limitMinutes, limitMusic]) {
  control.addEventListener("change", () => requestLimitChange(readLimitForm()));
}

(async () => {
  await initI18n();
  applyTranslations();
  const loaded = await loadSettings();
  limitMinutes.replaceChildren(
    ...MINUTE_CHOICES.map(
      (minutes) => new Option(formatDuration(minutes * 60_000), String(minutes)),
    ),
  );
  renderLimit(limitFrom(loaded));
  fillLanguages(loaded.language);
  await bindSettingToggles(document, {
    silentMode: {
      onEnable: async () =>
        (await hasBridgePermission()) ? true : requestBridgePermission(),
    },
  });
  const settings = await loadSettings();
  portsInput.value = settings.ports.join(", ");
  refreshGrant();
})();
