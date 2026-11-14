# SaveTube — YouTube extension

[![CI](https://github.com/goldendevuz/savetube-extension/actions/workflows/ci.yml/badge.svg)](https://github.com/goldendevuz/savetube-extension/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/goldendevuz/savetube-extension?sort=semver)](https://github.com/goldendevuz/savetube-extension/releases/latest)
[![License: GPL v3](https://img.shields.io/badge/license-GPLv3-blue.svg)](LICENSE)

Send any YouTube or YouTube Music video to the [SaveTube desktop app](https://github.com/goldendevuz/savetube-desktop) to **watch** or **download** — one click, no accounts, no scraping. The extension only ever transmits a video id (plus optional timestamp / playlist id); all extraction and playback happen natively inside SaveTube.

> SaveTube's extension is a fork of the [Flow extension](https://github.com/Flow-Tube/Flow-Extension) by A-EDev, released under GPL-3.0 like the original. Copyright © A-EDev; SaveTube's changes use the same licence.

## Install

**From a release (recommended)**

1. Download the latest build from [Releases](https://github.com/goldendevuz/savetube-extension/releases/latest):
   - `savetube-extension-chromium-vX.Y.Z.zip` for Chrome / Edge / Brave / Opera / Vivaldi
   - `savetube-extension-firefox-vX.Y.Z.zip` for Firefox
2. Unzip it.
3. Load it:
   - **Chromium** — `chrome://extensions` → enable **Developer mode** → **Load unpacked** → select the unzipped folder.
   - **Firefox** — `about:debugging` → **This Firefox** → **Load Temporary Add-on** → pick `manifest.json` inside the unzipped folder.

You also need the **SaveTube desktop app** installed for the handoff to do anything.

## How it works

Every action runs the same handoff cascade:

1. **Silent bridge** — if SaveTube is running, an HTTP request to `127.0.0.1` hands off instantly with no prompt.
2. **Deep link** — otherwise a `savetube://` link launches SaveTube if it's installed.
3. **Get SaveTube** — if nothing handles it, a toast links to the desktop release.

Surfaces: a button row under the watch-page player, a hover overlay on any video thumbnail, and right-click context-menu items.

## Project layout

```
src/
  lib/        constants, browser shim, settings, permissions, query
  bridge/     ping · http · deep-link · handoff cascade
  extract/    videoId / timestamp / playlist / selectors
  ui/         shadow host · styles · button · watch-row · overlay · toast
  content/    params · actions · navigation · messaging · main (entry)
  background/ context-menus · service-worker (entry)
  popup/      toolbar status + quick toggles
  options/    full settings
  manifest/   base + per-browser manifests
scripts/      icon rasteriser · zip · package · version check
build.mjs     esbuild bundler → dist/chromium + dist/firefox
```

Each module does one thing; nothing imports YouTube or SaveTube CSS. All injected UI lives in a Shadow DOM.

## Develop

```bash
npm install
npm run build          # → dist/chromium and dist/firefox
npm run dev            # rebuild on change (unminified, with logging)
npm run package        # zip both builds into release/
npm run release        # build + package
npm run format         # format with Prettier
```

Icons are generated from the SaveTube logo by a dependency-free SVG rasteriser (`scripts/`), so no binary assets are committed.

## Silent mode

Silent mode calls `127.0.0.1`, which needs an optional host permission requested on demand (from the popup or Settings). Without it the extension still works via the `savetube://` deep link — just with the browser's "Open SaveTube?" prompt. The popup shows live connection status once access is granted.

## Releasing

Releases are automated. To cut `vX.Y.Z`:

1. Bump `version` in `package.json`.
2. `git tag vX.Y.Z && git push --tags`.

The [release workflow](.github/workflows/release.yml) verifies the tag matches `package.json`, builds and packages both browsers, and publishes the zips to GitHub Releases with generated notes.

## The bridge contract

Shared with SaveTube Desktop — keep both sides identical.

```
savetube://watch?v=<ID>[&t=<SECONDS>][&list=<PLAYLIST_ID>]
savetube://download?v=<ID>
savetube://music?v=<ID>

GET http://127.0.0.1:47893/savetube/ping      → { "app": "savetube", "version": "…" }
GET http://127.0.0.1:47893/savetube/watch     ?v,t?,list?
GET http://127.0.0.1:47893/savetube/download  ?v
```

- Ports probed in order: `47893`, `47894`, `47895` (configurable in Settings).
- Video id: `^[A-Za-z0-9_-]{11}$`. Playlist id: `^[A-Za-z0-9_-]{10,64}$`.
- The desktop side validates every field and echoes CORS only for the allow-listed YouTube origins.

## License

[GPL-3.0-only](LICENSE).
