import { loadSettings, onSettingsChanged } from "../lib/settings.js";
import { currentWatchId } from "../extract/video-id.js";
import { injectWatchRow, removeWatchRow } from "../ui/watch-row.js";
import { initOverlay, setOverlayEnabled } from "../ui/overlay.js";
import { onNavigate } from "./navigation.js";
import { createActions } from "./actions.js";
import { listenForContextMenu } from "./messaging.js";
import { applyFocus } from "./focus.js";
import { startDailyLimit } from "./daily-limit.js";
import { log } from "../lib/log.js";
import { setLanguage } from "../lib/i18n.js";

let settings;
const actions = createActions(() => settings);

function render() {
  if (settings.watchPageRow && currentWatchId()) {
    injectWatchRow({
      onWatch: () => actions.watch(currentWatchId()),
      onDownload: () => actions.download(currentWatchId()),
    });
  } else {
    removeWatchRow();
  }
}

async function start() {
  settings = await loadSettings();
  setLanguage(settings.language);

  initOverlay({
    onWatch: (id) => actions.watch(id),
    onDownload: (id) => actions.download(id),
  });
  setOverlayEnabled(settings.overlayOnThumbnails);

  listenForContextMenu(actions);
  startDailyLimit(() => settings);
  applyFocus(settings);

  onNavigate(render);
  onSettingsChanged((next) => {
    settings = next;
    setLanguage(settings.language);
    setOverlayEnabled(settings.overlayOnThumbnails);
    applyFocus(settings);
    render();
  });

  render();
  log("content script ready");
}

start();
