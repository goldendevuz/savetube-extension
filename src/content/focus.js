import { focusCss } from "../lib/focus.js";

const STYLE_ID = "savetube-focus";
const AUTOPLAY_SELECTOR = ".ytp-autonav-toggle-button[aria-checked='true']";

let style;
let autoplayTimer;

function switchAutoplayOff() {
  document.querySelector(AUTOPLAY_SELECTOR)?.click();
}

/** Applies the focus options now and again whenever the settings change. */
export function applyFocus(settings) {
  const css = focusCss(settings);
  if (!css) {
    style?.remove();
    style = undefined;
  } else {
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      (document.head ?? document.documentElement).append(style);
    }
    if (style.textContent !== css) style.textContent = css;
  }

  clearInterval(autoplayTimer);
  autoplayTimer = undefined;
  if (settings.disableAutoplay) {
    // The switch is drawn after the player, and again for each video, so keep looking for it.
    switchAutoplayOff();
    autoplayTimer = setInterval(switchAutoplayOff, 2000);
  }
}
