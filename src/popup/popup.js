import { api } from "../lib/browser.js";
import { bindSettingToggles } from "../lib/bind-settings.js";
import { findRunning } from "../bridge/ping.js";
import { hasBridgePermission, requestBridgePermission } from "../lib/permissions.js";
import { SAVETUBE_RELEASE_URL } from "../lib/const.js";
import { initI18n, applyTranslations, t } from "../lib/i18n.js";

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
})();
