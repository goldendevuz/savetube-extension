import { floatingRoot, FLOATING_HOST_ID } from "./shadow-host.js";
import { createButton } from "./button.js";
import { playIcon, downloadIcon } from "./icons.js";
import { CARD_SELECTOR } from "../extract/selectors.js";
import { idFromCard } from "../extract/video-id.js";
import { t } from "../lib/i18n.js";

const HIDE_DELAY_MS = 120;

let overlayEl;
let handlers = null;
let enabled = false;
let listening = false;
let activeCard = null;
let activeId = null;
let hideTimer;

function ensureOverlay() {
  if (overlayEl?.isConnected) return overlayEl;

  overlayEl = document.createElement("div");
  overlayEl.className = "savetube-overlay";
  overlayEl.append(
    createButton({
      icon: playIcon,
      variant: "icon",
      title: t("Watch in SaveTube"),
      onClick: () => activeId && handlers?.onWatch(activeId),
    }),
    createButton({
      icon: downloadIcon,
      variant: "icon",
      title: t("Download with SaveTube"),
      onClick: () => activeId && handlers?.onDownload(activeId),
    }),
  );
  floatingRoot().appendChild(overlayEl);
  return overlayEl;
}

const THUMBNAIL_SELECTOR =
  "ytd-thumbnail, yt-thumbnail-view-model, a#thumbnail, ytmusic-thumbnail-renderer";

function show(card, id) {
  cancelHide();
  activeCard = card;
  activeId = id;
  const el = ensureOverlay();
  el.classList.add("is-visible");
  // The overlay sits on the thumbnail's top-right corner; a list row is wider than its thumbnail, so the
  // whole card would put it at the far edge of the row.
  const thumbnail = card.querySelector(THUMBNAIL_SELECTOR);
  let rect = thumbnail?.getBoundingClientRect();
  if (!rect || rect.width < 40 || rect.height < 20) rect = card.getBoundingClientRect();
  el.style.top = `${Math.round(rect.top + 8)}px`;
  el.style.left = `${Math.round(rect.right - el.offsetWidth - 8)}px`;
}

function hide() {
  cancelHide();
  activeCard = null;
  activeId = null;
  overlayEl?.classList.remove("is-visible");
}

function cancelHide() {
  clearTimeout(hideTimer);
}

// Delayed hide so the cursor crossing the gap between card and overlay — or
// mouseover retargeting to our own host — doesn't flicker the overlay.
function scheduleHide() {
  clearTimeout(hideTimer);
  hideTimer = setTimeout(hide, HIDE_DELAY_MS);
}

function onMouseOver(e) {
  if (!enabled) return;
  const target = e.target;
  if (!(target instanceof Element)) return;

  // Hovering our own floating UI: events retarget to the shadow host, so the
  // card lookup below would miss. Keep the overlay open instead.
  if (target.id === FLOATING_HOST_ID) {
    cancelHide();
    return;
  }

  const card = target.closest(CARD_SELECTOR);
  if (!card) {
    // YouTube's own hover preview opens in its own element, outside the card; the cursor is still on the card.
    if (activeCard && target.closest("ytd-video-preview")) {
      cancelHide();
      return;
    }
    scheduleHide();
    return;
  }
  if (card === activeCard) {
    cancelHide();
    return;
  }

  const id = idFromCard(card);
  if (!id) {
    scheduleHide();
    return;
  }
  show(card, id);
}

export function initOverlay(nextHandlers) {
  handlers = nextHandlers;
  if (listening) return;
  listening = true;
  document.addEventListener("mouseover", onMouseOver, { passive: true });
  document.addEventListener("scroll", hide, { passive: true, capture: true });
  window.addEventListener("resize", hide);
}

export function setOverlayEnabled(value) {
  enabled = value;
  if (!enabled) hide();
}
