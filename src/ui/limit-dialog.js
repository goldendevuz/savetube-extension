import { floatingRoot } from "./shadow-host.js";
import { t } from "../lib/i18n.js";
import { formatDuration } from "../lib/format-duration.js";
import { WAIT_MS } from "../lib/daily-limit.js";

let dialogEl;
let timer;

export function hideLimitDialog() {
  clearInterval(timer);
  dialogEl?.remove();
  dialogEl = undefined;
}

export function isLimitDialogShown() {
  return !!dialogEl?.isConnected;
}

// Shown when the daily limit runs out: today's time, Close, and Keep watching once the wait has passed.
export function showLimitDialog({ playedMs, limitMs, onKeepWatching }) {
  hideLimitDialog();

  dialogEl = document.createElement("div");
  dialogEl.className = "savetube-limit";
  dialogEl.setAttribute("role", "dialog");
  dialogEl.setAttribute("aria-modal", "true");

  const card = document.createElement("div");
  card.className = "savetube-limit__card";

  const title = document.createElement("h2");
  title.className = "savetube-limit__title";
  title.textContent = t("Time's up");

  const body = document.createElement("p");
  body.className = "savetube-limit__body";
  body.textContent = t(
    "You watched %s today. Your daily limit is %s.",
    formatDuration(playedMs),
    formatDuration(limitMs),
  );

  const note = document.createElement("p");
  note.className = "savetube-limit__note";
  note.textContent = t("Keep watching adds 15 minutes.");

  const actions = document.createElement("div");
  actions.className = "savetube-limit__actions";

  const keep = document.createElement("button");
  keep.type = "button";
  keep.className = "savetube-limit__btn";
  keep.disabled = true;

  const close = document.createElement("button");
  close.type = "button";
  close.className = "savetube-limit__btn savetube-limit__btn--primary";
  close.textContent = t("Close");
  close.addEventListener("click", hideLimitDialog);

  keep.addEventListener("click", async () => {
    keep.disabled = true;
    await onKeepWatching();
    hideLimitDialog();
  });

  const openedAt = Date.now();
  const refresh = () => {
    const secondsLeft = Math.max(0, Math.ceil((openedAt + WAIT_MS - Date.now()) / 1000));
    keep.disabled = secondsLeft > 0;
    keep.textContent =
      secondsLeft > 0 ? t("Keep watching in %s s", secondsLeft) : t("Keep watching");
  };
  refresh();
  timer = setInterval(refresh, 500);

  actions.append(keep, close);
  card.append(title, body, note, actions);
  dialogEl.appendChild(card);
  floatingRoot().appendChild(dialogEl);
}
