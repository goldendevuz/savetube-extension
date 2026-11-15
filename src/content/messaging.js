import { api } from "../lib/browser.js";
import { MSG, ACTION } from "../lib/messages.js";
import { idFromWatchUrl, currentWatchId } from "../extract/video-id.js";
import { toast } from "../ui/toast.js";
import { t } from "../lib/i18n.js";

// Handles context-menu clicks forwarded from the background service worker.
export function listenForContextMenu(actions) {
  api.runtime.onMessage.addListener((msg) => {
    if (msg?.type !== MSG.HANDOFF) return;

    const id = idFromWatchUrl(msg.src) || currentWatchId();
    if (!id) {
      toast({ message: t("No YouTube video found here"), variant: "error" });
      return;
    }

    if (msg.action === ACTION.DOWNLOAD) actions.download(id);
    else actions.watch(id);
  });
}
