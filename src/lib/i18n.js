import { loadSettings } from "./settings.js";
import { STORE } from "./edition.js";
import { DOWNLOAD_TEXT } from "./i18n-download.js";

// The extension's own translations. Chrome's built-in extension locales have no Uzbek, so the text is kept
// here, keyed by the English text, and the language is a setting ("auto" follows the browser).

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
  { code: "uz", label: "Oʻzbekcha" },
];

const BASE = {
  ru: {
    "Daily limit": "Дневной лимит",
    "Pause videos after a set time each day":
      "Приостанавливать видео после заданного времени каждый день",
    Limit: "Лимит",
    "How long videos can play each day":
      "Сколько времени видео могут воспроизводиться каждый день",
    "Count music too": "Считать и музыку",
    "YouTube Music counts toward the limit and pauses with it":
      "YouTube Music учитывается в лимите и приостанавливается вместе с ним",
    "Counts the time videos play on YouTube in this browser.":
      "Считает время воспроизведения видео на YouTube в этом браузере.",
    "Change your limit?": "Изменить лимит?",
    "Your limit already ran out today, so changing it takes a short wait.":
      "Ваш лимит сегодня уже исчерпан, поэтому для изменения нужно немного подождать.",
    Change: "Изменить",
    Close: "Закрыть",
    "Wait %s s": "Подождите %s с",
    "Time's up": "Время вышло",
    "You watched %s today. Your daily limit is %s.":
      "Сегодня вы смотрели %s. Ваш дневной лимит: %s.",
    "Keep watching adds 15 minutes.": "«Продолжить просмотр» добавляет 15 минут.",
    "Keep watching in %s s": "Продолжить просмотр через %s с",
    "Keep watching": "Продолжить просмотр",
    "5 minutes left today": "Сегодня осталось 5 минут",
    "%s h %s min": "%s ч %s мин",
    "%s min": "%s мин",
    "Today: %s of %s": "Сегодня: %s из %s",
    "Open YouTube videos in the SaveTube desktop app.":
      "Открывайте видео YouTube в приложении SaveTube для компьютера.",
    "Add a Watch row under the player": "Добавить ряд «Смотреть» под плеером",
    "Play music.youtube.com links in SaveTube’s music player":
      "Воспроизводить ссылки music.youtube.com в музыкальном плеере SaveTube",
    "SaveTube — Watch on YouTube": "SaveTube — смотреть на YouTube",
    "SaveTube — Settings": "SaveTube — Настройки",
    "SaveTube for YouTube": "SaveTube для YouTube",
    Surfaces: "Где показывать",
    "Thumbnail overlay": "Кнопки на превью",
    "Hover any video card for quick actions":
      "Наведите курсор на любое видео для быстрых действий",
    "Overlay on thumbnails": "Кнопки на превью",
    "Watch-page buttons": "Кнопки на странице просмотра",
    Handoff: "Передача",
    "Include timestamp": "Передавать время",
    "Continue where you paused on “Watch in SaveTube”":
      "Продолжать с места паузы при нажатии «Смотреть в SaveTube»",
    "Route YouTube Music as music": "Открывать YouTube Music как музыку",
    "Silent bridge": "Тихий мост",
    "Silent mode": "Тихий режим",
    "Use the local bridge so SaveTube reacts without an “Open?” prompt":
      "Использовать локальный мост, чтобы SaveTube отвечал без запроса «Открыть?»",
    "No prompt when SaveTube is running": "Без запроса, когда SaveTube запущен",
    "Local access": "Локальный доступ",
    "Required for silent mode and status detection":
      "Нужен для тихого режима и определения состояния",
    "Grant access": "Разрешить доступ",
    "Access granted": "Доступ разрешён",
    "Bridge ports": "Порты моста",
    "Advanced — must match SaveTube Desktop":
      "Дополнительно: должны совпадать с SaveTube для компьютера",
    "Extension repo": "Репозиторий расширения",
    "Get SaveTube desktop": "Скачать SaveTube для компьютера",
    "Get SaveTube": "Скачать SaveTube",
    Settings: "Настройки",
    "Checking…": "Проверка…",
    "Enable silent mode": "Включите тихий режим",
    Connected: "Подключено",
    "Connected · v%s": "Подключено · v%s",
    "Not running": "Не запущено",
    Language: "Язык",
    Automatic: "Автоматически",
    "Watch in SaveTube": "Смотреть в SaveTube",
    "Sent to SaveTube": "Отправлено в SaveTube",
    "Opening SaveTube…": "Открываем SaveTube…",
    "SaveTube isn't installed": "SaveTube не установлен",
    "No YouTube video found here": "Здесь не найдено видео YouTube",
  },
  uz: {
    "Daily limit": "Kunlik chegara",
    "Pause videos after a set time each day":
      "Har kuni belgilangan vaqtdan keyin videolarni toʻxtatish",
    Limit: "Chegara",
    "How long videos can play each day":
      "Videolar har kuni qancha vaqt ijro etilishi mumkin",
    "Count music too": "Musiqani ham hisoblash",
    "YouTube Music counts toward the limit and pauses with it":
      "YouTube Music chegaraga hisoblanadi va u bilan birga toʻxtaydi",
    "Counts the time videos play on YouTube in this browser.":
      "Shu brauzerda YouTubeʼda videolar ijro etilgan vaqtni hisoblaydi.",
    "Change your limit?": "Chegarani oʻzgartirasizmi?",
    "Your limit already ran out today, so changing it takes a short wait.":
      "Chegarangiz bugun allaqachon tugagan, shuning uchun uni oʻzgartirish uchun qisqa kutish kerak.",
    Change: "Oʻzgartirish",
    Close: "Yopish",
    "Wait %s s": "%s s kuting",
    "Time's up": "Vaqt tugadi",
    "You watched %s today. Your daily limit is %s.":
      "Bugun %s koʻrdingiz. Kunlik chegarangiz %s.",
    "Keep watching adds 15 minutes.": "Koʻrishda davom etish 15 daqiqa qoʻshadi.",
    "Keep watching in %s s": "%s s dan keyin koʻrishda davom etish",
    "Keep watching": "Koʻrishda davom etish",
    "5 minutes left today": "Bugun 5 daqiqa qoldi",
    "%s h %s min": "%s soat %s daq",
    "%s min": "%s daq",
    "Today: %s of %s": "Bugun: %s / %s",
    "Open YouTube videos in the SaveTube desktop app.":
      "YouTube videolarini kompyuterdagi SaveTube ilovasida oching.",
    "Add a Watch row under the player": "Pleyer ostiga «Koʻrish» qatorini qoʻshish",
    "Play music.youtube.com links in SaveTube’s music player":
      "music.youtube.com havolalarini SaveTube musiqa pleyerida ijro etish",
    "SaveTube — Watch on YouTube": "SaveTube — YouTube’da koʻrish",
    "SaveTube — Settings": "SaveTube — Sozlamalar",
    "SaveTube for YouTube": "YouTube uchun SaveTube",
    Surfaces: "Qayerda ko‘rsatish",
    "Thumbnail overlay": "Muqovadagi tugmalar",
    "Hover any video card for quick actions":
      "Tezkor amallar uchun istalgan video ustiga kursorni olib boring",
    "Overlay on thumbnails": "Muqovadagi tugmalar",
    "Watch-page buttons": "Ko‘rish sahifasidagi tugmalar",
    Handoff: "Topshirish",
    "Include timestamp": "Vaqtni ham yuborish",
    "Continue where you paused on “Watch in SaveTube”":
      "“SaveTube da ko‘rish” bosilganda to‘xtagan joyingizdan davom etish",
    "Route YouTube Music as music": "YouTube Music ni musiqa sifatida ochish",
    "Silent bridge": "Jimjit ko‘prik",
    "Silent mode": "Jimjit rejim",
    "Use the local bridge so SaveTube reacts without an “Open?” prompt":
      "SaveTube “Ochilsinmi?” so‘ramasdan javob berishi uchun mahalliy ko‘prikdan foydalanish",
    "No prompt when SaveTube is running": "SaveTube ishlab turganda so‘rovsiz",
    "Local access": "Mahalliy ruxsat",
    "Required for silent mode and status detection":
      "Jimjit rejim va holatni aniqlash uchun kerak",
    "Grant access": "Ruxsat berish",
    "Access granted": "Ruxsat berilgan",
    "Bridge ports": "Ko‘prik portlari",
    "Advanced — must match SaveTube Desktop":
      "Qo‘shimcha: SaveTube kompyuter ilovasi bilan mos bo‘lishi kerak",
    "Extension repo": "Kengaytma repozitoriysi",
    "Get SaveTube desktop": "SaveTube kompyuter ilovasini olish",
    "Get SaveTube": "SaveTube ni olish",
    Settings: "Sozlamalar",
    "Checking…": "Tekshirilmoqda…",
    "Enable silent mode": "Jimjit rejimni yoqing",
    Connected: "Ulangan",
    "Connected · v%s": "Ulangan · v%s",
    "Not running": "Ishlamayapti",
    Language: "Til",
    Automatic: "Avtomatik",
    "Watch in SaveTube": "SaveTube da ko‘rish",
    "Sent to SaveTube": "SaveTube ga yuborildi",
    "Opening SaveTube…": "SaveTube ochilmoqda…",
    "SaveTube isn't installed": "SaveTube o‘rnatilmagan",
    "No YouTube video found here": "Bu yerda YouTube videosi topilmadi",
  },
};

// Download wording is kept out of the Chrome Web Store build (see ./edition.js).
const TABLES = {
  ru: { ...BASE.ru, ...(STORE ? {} : DOWNLOAD_TEXT.ru) },
  uz: { ...BASE.uz, ...(STORE ? {} : DOWNLOAD_TEXT.uz) },
};

// Uzbek uses the standard Latin letters: oʻ and gʻ with U+02BB, the apostrophe sign with U+02BC.
for (const key of Object.keys(TABLES.uz)) {
  TABLES.uz[key] = TABLES.uz[key].replace(/‘/g, "ʻ").replace(/’/g, "ʼ");
}

let current = "en";

const clean = (text) => text.replace(/\s+/g, " ").trim();

/** The language a setting value means: a choice, or for "auto" the browser's language. */
export function resolveLanguage(choice) {
  if (choice === "en" || choice === "ru" || choice === "uz") return choice;
  const tag = String(
    globalThis.navigator?.languages?.[0] ?? globalThis.navigator?.language ?? "en",
  )
    .toLowerCase()
    .split("-")[0];
  return tag === "ru" || tag === "uz" ? tag : "en";
}

export function setLanguage(choice) {
  current = resolveLanguage(choice);
}

export function currentLanguage() {
  return current;
}

/** Reads the saved language; call before anything shows text. */
export async function initI18n() {
  try {
    setLanguage((await loadSettings()).language);
  } catch {
    current = "en";
  }
}

/** The text in the current language, with `%s` filled from `values`. Untranslated text stays English. */
export function t(text, ...values) {
  const base = current === "en" ? text : (TABLES[current][text] ?? text);
  let next = 0;
  return base.replace(/%s/g, () => String(values[next++] ?? ""));
}

/** Translates the text and the titles already in a page's HTML. */
export function applyTranslations(root = document) {
  document.documentElement.lang = current;
  if (current === "en") return;
  const table = TABLES[current];
  if (root === document && table[clean(document.title)])
    document.title = table[clean(document.title)];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const key = clean(node.nodeValue ?? "");
    const translated = key && table[key];
    if (!translated) continue;
    const [, lead, , tail] = /^(\s*)([\s\S]*?)(\s*)$/.exec(node.nodeValue);
    node.nodeValue = lead + translated + tail;
  }
}
