import { WATCH_METADATA_SELECTOR, WATCH_ROW_CONTAINERS } from "../extract/selectors.js";
import { createInlineHost } from "./shadow-host.js";
import { createButton } from "./button.js";
import { playIcon, downloadIcon } from "./icons.js";
import { t } from "../lib/i18n.js";
import { STORE } from "../lib/edition.js";

const HOST_ID = "savetube-ext-watch-row";
const HOST_CSS = "all: initial; display: block; width: 100%;";

function place(host) {
  const metadata = document.querySelector(WATCH_METADATA_SELECTOR);
  if (metadata?.parentElement) {
    metadata.parentElement.insertBefore(host, metadata);
    return true;
  }
  for (const selector of WATCH_ROW_CONTAINERS) {
    const container = document.querySelector(selector);
    if (container) {
      container.prepend(host);
      return true;
    }
  }
  return false;
}

export function injectWatchRow({ onWatch, onDownload }) {
  if (document.getElementById(HOST_ID)) return true;

  const { host, root } = createInlineHost(HOST_ID, HOST_CSS);
  const row = document.createElement("div");
  row.className = "savetube-watchbar";
  row.append(
    createButton({
      icon: playIcon,
      label: t("Watch in SaveTube"),
      variant: "primary",
      onClick: onWatch,
    }),
    ...(STORE
      ? []
      : [
          createButton({
            icon: downloadIcon,
            label: t("Download"),
            onClick: onDownload,
          }),
        ]),
  );
  root.appendChild(row);

  if (!place(host)) return false;
  return true;
}

export function removeWatchRow() {
  document.getElementById(HOST_ID)?.remove();
}
