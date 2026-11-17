// The "block features" options: each one hides or changes a part of YouTube with a rule that is only in the page while
// its setting is on.

export const FOCUS_KEYS = [
  "hideHome",
  "hideShorts",
  "hideComments",
  "hideRecommended",
  "hideThumbnails",
  "blurThumbnails",
  "hideSubscriptions",
  "hideExplore",
  "hideTopBar",
  "disableEndCards",
  "blackWhite",
];

const GUIDE_ENTRY = "ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer";

export const FOCUS_RULES = {
  hideHome: `ytd-browse[page-subtype="home"], ${GUIDE_ENTRY.split(", ")
    .map((s) => `${s}:has(a[href="/"])`)
    .join(", ")} { display: none !important; }`,
  hideShorts:
    [
      "ytd-reel-shelf-renderer",
      "ytd-rich-shelf-renderer[is-shorts]",
      "ytd-shorts",
      "grid-shelf-view-model",
      "ytd-rich-item-renderer:has(a[href^='/shorts/'])",
      "ytd-video-renderer:has(a[href^='/shorts/'])",
      "ytd-grid-video-renderer:has(a[href^='/shorts/'])",
      "ytd-compact-video-renderer:has(a[href^='/shorts/'])",
      "yt-tab-shape[tab-title='Shorts']",
      ...GUIDE_ENTRY.split(", ").map((s) => `${s}:has(a[href^='/shorts'])`),
      "ytd-mini-guide-entry-renderer[aria-label='Shorts']",
    ].join(", ") + " { display: none !important; }",
  hideComments: "ytd-comments, #comments { display: none !important; }",
  hideRecommended:
    "#related, ytd-watch-next-secondary-results-renderer { display: none !important; }",
  hideThumbnails:
    "ytd-thumbnail, yt-thumbnail-view-model, ytd-playlist-thumbnail, .ytp-videowall-still-image { visibility: hidden !important; }",
  blurThumbnails:
    "ytd-thumbnail, yt-thumbnail-view-model, ytd-playlist-thumbnail, .ytp-videowall-still-image { filter: blur(18px) !important; }",
  hideSubscriptions:
    GUIDE_ENTRY.split(", ")
      .map((s) => `${s}:has(a[href='/feed/subscriptions'])`)
      .concat(["ytd-guide-section-renderer:has(a[href^='/@']):has(#guide-section-title)"])
      .join(", ") + " { display: none !important; }",
  hideExplore:
    GUIDE_ENTRY.split(", ")
      .flatMap((s) => [
        `${s}:has(a[href='/feed/explore'])`,
        `${s}:has(a[href='/feed/trending'])`,
      ])
      .join(", ") + " { display: none !important; }",
  hideTopBar:
    "#masthead-container, ytd-masthead { display: none !important; } ytd-page-manager { margin-top: 0 !important; }",
  disableEndCards:
    ".ytp-ce-element, .ytp-endscreen-content, .ytp-ce-covering-overlay, .html5-endscreen, .ytp-videowall-still { display: none !important; }",
  blackWhite: "html { filter: grayscale(1) !important; }",
};

/** The style text for the settings that are on. */
export function focusCss(settings) {
  return FOCUS_KEYS.filter((key) => settings[key])
    .map((key) => FOCUS_RULES[key])
    .join("\n");
}
