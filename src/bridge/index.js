import { findRunning } from "./ping.js";
import { sendToBridge } from "./http.js";
import { buildDeepLink, launchDeepLink } from "./deep-link.js";
import { SAVETUBE_RELEASE_URL } from "../lib/const.js";
import { log } from "../lib/log.js";

export const HANDOFF = {
  SILENT: "silent",
  LAUNCHED: "launched",
  NOT_INSTALLED: "not_installed",
};

// A → B → CTA cascade:
//   (A) localhost bridge if SaveTube is running (silent, instant)
//   (B) savetube:// deep link (launches SaveTube if installed)
//   (C) "Get SaveTube" toast if nothing handled it
export async function handoff(action, params, { ports, silent = true, toast } = {}) {
  if (silent) {
    const running = await findRunning(ports);
    if (running) {
      try {
        if (await sendToBridge(running.port, action, params)) {
          toast?.({ message: "Sent to SaveTube", variant: "success" });
          return HANDOFF.SILENT;
        }
      } catch (err) {
        log("bridge send failed", err);
      }
    }
  }

  if (await launchDeepLink(buildDeepLink(action, params))) {
    toast?.({ message: "Opening SaveTube…", variant: "info" });
    return HANDOFF.LAUNCHED;
  }

  toast?.({
    message: "SaveTube isn't installed",
    variant: "error",
    cta: { label: "Get SaveTube", href: SAVETUBE_RELEASE_URL },
  });
  return HANDOFF.NOT_INSTALLED;
}
