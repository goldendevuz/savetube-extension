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
    "Today's goal": "Цель на сегодня",
    "One thing you want to get done today": "Одно дело, которое хотите сделать сегодня",
    "Write today's goal": "Напишите цель на сегодня",
    "Clear": "Очистить",
    "When you watch": "Когда вы смотрите",
    "Nothing counted yet. It fills in as you watch.": "Пока ничего не посчитано. Заполнится по мере просмотра.",
    "Most of your watching happens at %s": "Больше всего вы смотрите в %s",
    "%s in this browser in the last 28 days": "%s в этом браузере за последние 28 дней",
    "Session %s min": "Сеанс %s мин",
    "Streak": "Серия дней",
    "days in a row within your limit": "дн. подряд в рамках лимита",
    "Best: %s": "Рекорд: %s",
    "Next badge at %s days": "Следующая награда: %s дн.",
    "Every badge earned": "Все награды получены",
    "Streak: %s days": "Серия: %s дн.",
    "Streak: %s days in a row within your limit": "Серия: %s дн. подряд в рамках лимита",
    "Daily limit": "Дневной лимит",
    "Pause videos after a set time each day":
      "Приостанавливать видео после заданного времени каждый день",
    Limit: "Лимит",
    "How long videos can play each day":
      "Сколько времени видео могут воспроизводиться каждый день",
    "Count music too": "Считать и музыку",
    "Block features": "Блокировка функций",
    "Hide Home page": "Скрыть главную",
    "Hide the YouTube home feed": "Скрыть ленту главной страницы YouTube",
    "Hide Shorts": "Скрыть Shorts",
    "Hide Shorts shelves, tabs and the menu entry":
      "Скрыть полки, вкладки и пункт меню Shorts",
    "Hide comments": "Скрыть комментарии",
    "Hide the comments under videos": "Скрыть комментарии под видео",
    "Hide recommended videos": "Скрыть рекомендуемые видео",
    "Hide the videos suggested beside the player":
      "Скрыть видео, предложенные рядом с плеером",
    "Hide thumbnails": "Скрыть превью",
    "Hide the picture of every video": "Скрыть картинку у каждого видео",
    "Blur thumbnails": "Размыть превью",
    "Blur the picture of every video": "Размыть картинку у каждого видео",
    "Hide subscriptions": "Скрыть подписки",
    "Hide Subscriptions in the side menu": "Скрыть «Подписки» в боковом меню",
    "Hide Explore": "Скрыть «Навигатор»",
    "Hide Explore and Trending in the side menu":
      "Скрыть «Навигатор» и «В тренде» в боковом меню",
    "Hide top bar": "Скрыть верхнюю панель",
    "Hide the top bar including the search box":
      "Скрыть верхнюю панель вместе со строкой поиска",
    "Disable end cards": "Отключить конечные карточки",
    "Hide the video suggestions shown in the player at the end of a video":
      "Скрыть предложения видео, которые появляются в плеере в конце видео",
    "Black & white mode": "Чёрно-белый режим",
    "Show YouTube in black and white only":
      "Показывать YouTube только в чёрно-белом цвете",
    "Disable autoplay": "Отключить автовоспроизведение",
    "Do not play the next video automatically at the end of a video":
      "Не включать следующее видео автоматически в конце видео",
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
    "Today's goal": "Bugungi maqsad",
    "One thing you want to get done today": "Bugun bajarmoqchi boʻlgan bitta ish",
    "Write today's goal": "Bugungi maqsadni yozing",
    "Clear": "Tozalash",
    "When you watch": "Qaysi soatda koʻrasiz",
    "Nothing counted yet. It fills in as you watch.": "Hali hisoblanmagan. Tomosha qilgan sari toʻlib boradi.",
    "Most of your watching happens at %s": "Koʻproq tomosha %s da boʻladi",
    "%s in this browser in the last 28 days": "Shu brauzerda oxirgi 28 kunda %s",
    "Session %s min": "Seans %s daq",
    "Streak": "Ketma-ket kunlar",
    "days in a row within your limit": "kun ketma-ket limit ichida",
    "Best: %s": "Eng yaxshi: %s",
    "Next badge at %s days": "Keyingi nishon: %s kun",
    "Every badge earned": "Barcha nishonlar olingan",
    "Streak: %s days": "Ketma-ket: %s kun",
    "Streak: %s days in a row within your limit": "Ketma-ket: %s kun limit ichida",
    "Daily limit": "Kunlik chegara",
    "Pause videos after a set time each day":
      "Har kuni belgilangan vaqtdan keyin videolarni toʻxtatish",
    Limit: "Chegara",
    "How long videos can play each day":
      "Videolar har kuni qancha vaqt ijro etilishi mumkin",
    "Count music too": "Musiqani ham hisoblash",
    "Block features": "Funksiyalarni bloklash",
    "Hide Home page": "Bosh sahifani yashirish",
    "Hide the YouTube home feed": "YouTube bosh sahifa lentasini yashirish",
    "Hide Shorts": "Shortsni yashirish",
    "Hide Shorts shelves, tabs and the menu entry":
      "Shorts qatorlari, yorliqlari va menyu bandini yashirish",
    "Hide comments": "Izohlarni yashirish",
    "Hide the comments under videos": "Videolar ostidagi izohlarni yashirish",
    "Hide recommended videos": "Tavsiya etilgan videolarni yashirish",
    "Hide the videos suggested beside the player":
      "Pleer yonidagi tavsiya videolarni yashirish",
    "Hide thumbnails": "Miniatyuralarni yashirish",
    "Hide the picture of every video": "Har bir videoning rasmini yashirish",
    "Blur thumbnails": "Miniatyuralarni xiralashtirish",
    "Blur the picture of every video": "Har bir videoning rasmini xiralashtirish",
    "Hide subscriptions": "Obunalarni yashirish",
    "Hide Subscriptions in the side menu": "Yon menyudagi Obunalarni yashirish",
    "Hide Explore": "Kashfiyotni yashirish",
    "Hide Explore and Trending in the side menu":
      "Yon menyudagi Kashfiyot va Trendni yashirish",
    "Hide top bar": "Yuqori panelni yashirish",
    "Hide the top bar including the search box":
      "Yuqori panelni, qidiruv qatori bilan birga, yashirish",
    "Disable end cards": "Oxirgi kartochkalarni oʻchirish",
    "Hide the video suggestions shown in the player at the end of a video":
      "Video oxirida pleerda chiqadigan tavsiyalarni yashirish",
    "Black & white mode": "Oq-qora rejim",
    "Show YouTube in black and white only": "YouTubeʼni faqat oq-qora koʻrsatish",
    "Disable autoplay": "Avtoijroni oʻchirish",
    "Do not play the next video automatically at the end of a video":
      "Video tugagach keyingisini avtomatik ijro etmaslik",
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
