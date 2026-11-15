import esbuild from "esbuild";
import { rm, mkdir, cp, writeFile, access, readFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "./src/manifest/chromium.js";
import { firefox } from "./src/manifest/firefox.js";
import { generateIcons } from "./scripts/gen-icons.mjs";

const dev = process.argv.includes("--dev");
const watch = process.argv.includes("--watch");
const store = process.argv.includes("--store");

const { version } = JSON.parse(await readFile("package.json", "utf8"));

// The Chrome Web Store edition: Chromium only, no download actions, neutral name and wording.
const STORE_MANIFEST = {
  ...chromium,
  name: "SaveTube — Watch on YouTube",
  description: "Open YouTube videos in the SaveTube desktop app.",
};
const STORE_TEXT = [
  [
    "Send videos to the SaveTube desktop app to watch or download.",
    "Open YouTube videos in the SaveTube desktop app.",
  ],
  ["Add a Watch/Download row under the player", "Add a Watch row under the player"],
  [
    "Play and download music.youtube.com links in SaveTube’s music player",
    "Play music.youtube.com links in SaveTube’s music player",
  ],
];

const TARGETS = store ? { "store-chromium": STORE_MANIFEST } : { chromium, firefox };

const ENTRY_POINTS = {
  content: "src/content/main.js",
  background: "src/background/index.js",
  "popup/popup": "src/popup/popup.js",
  "options/options": "src/options/options.js",
};

const STATIC_FILES = [
  ["src/popup/popup.html", "popup/popup.html"],
  ["src/popup/popup.css", "popup/popup.css"],
  ["src/options/options.html", "options/options.html"],
  ["src/options/options.css", "options/options.css"],
];

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function ensureIcons() {
  if (!(await exists("icons/16.png"))) await generateIcons("icons");
}

async function copyStatics(outdir) {
  for (const [from, to] of STATIC_FILES) {
    await cp(from, path.join(outdir, to));
  }
  await cp("icons", path.join(outdir, "icons"), { recursive: true });
}

async function neutraliseText(outdir) {
  const file = path.join(outdir, "options/options.html");
  let html = await readFile(file, "utf8");
  for (const [from, to] of STORE_TEXT) {
    // prettier may wrap the text, so match it with any whitespace between words
    const pattern = new RegExp(
      from
        .split(/\s+/)
        .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("\\s+"),
    );
    if (!pattern.test(html)) throw new Error(`store text not found: ${from}`);
    html = html.replace(pattern, to);
  }
  await writeFile(file, html);
}

async function buildTarget(name, manifest) {
  const outdir = path.join("dist", name);
  await rm(outdir, { recursive: true, force: true });
  await mkdir(path.join(outdir, "popup"), { recursive: true });
  await mkdir(path.join(outdir, "options"), { recursive: true });

  const context = await esbuild.context({
    entryPoints: ENTRY_POINTS,
    outdir,
    bundle: true,
    format: "iife",
    target: ["chrome110", "firefox115"],
    define: { __DEV__: String(dev), __STORE__: String(store) },
    plugins: store
      ? [
          {
            // the download wording must not ship in the store edition
            name: "no-download-text",
            setup(build) {
              build.onLoad({ filter: /i18n-download\.js$/ }, () => ({
                contents: "export const DOWNLOAD_TEXT = { ru: {}, uz: {} };",
                loader: "js",
              }));
            },
          },
        ]
      : [],
    minify: !dev,
    sourcemap: dev,
    legalComments: "none",
    logLevel: "info",
  });

  await context.rebuild();
  await copyStatics(outdir);
  if (store) await neutraliseText(outdir);
  await writeFile(
    path.join(outdir, "manifest.json"),
    JSON.stringify({ ...manifest, version }, null, 2),
  );

  if (watch) {
    await context.watch();
    return context;
  }
  await context.dispose();
  return null;
}

await ensureIcons();
const contexts = [];
for (const [name, manifest] of Object.entries(TARGETS)) {
  const ctx = await buildTarget(name, manifest);
  if (ctx) contexts.push(ctx);
  console.log(`built dist/${name}`);
}

if (watch) {
  console.log("watching for changes… (ctrl+c to stop)");
} else {
  console.log("done");
}
