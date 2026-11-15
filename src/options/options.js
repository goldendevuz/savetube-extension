import { api } from "../lib/browser.js";
import { bindSettingToggles } from "../lib/bind-settings.js";
import { loadSettings, saveSettings, DEFAULT_SETTINGS } from "../lib/settings.js";
import { hasBridgePermission, requestBridgePermission } from "../lib/permissions.js";
import { SAVETUBE_RELEASE_URL, EXTENSION_REPO_URL } from "../lib/const.js";
import { LANGUAGES, initI18n, applyTranslations, t } from "../lib/i18n.js";

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

(async () => {
  await initI18n();
  applyTranslations();
  fillLanguages((await loadSettings()).language);
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
