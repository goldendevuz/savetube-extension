import { t } from "./i18n.js";

// "1 h 30 min" or "45 min", in the chosen language.
export function formatDuration(ms) {
  const total = Math.floor(ms / 60_000);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return hours > 0 ? t("%s h %s min", hours, minutes) : t("%s min", minutes);
}
