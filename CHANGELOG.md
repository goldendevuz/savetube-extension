# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Daily limit, the same rules as the SaveTube apps: set how long videos may play each day (15 minutes to 8 hours; YouTube Music counts only if you ask). A warning comes five minutes before the end, everything pauses when the time is up, and Keep watching adds 15 minutes after a 30 second wait. Turning the limit off or lowering it after it ran out waits 30 seconds first. The popup shows today's time.

## [1.0.4] - 2026-11-15

### Added

- A Chrome Web Store edition (`npm run release:store`): Watch only, with no download buttons, no download menu item and neutral wording, named "SaveTube — Watch on YouTube". The store rejected the first submission because it helped download YouTube videos. The full edition, with Download, is still built by `npm run release` and installed by hand.
- The extension speaks English, Russian and Uzbek: the popup, the settings page, the buttons on YouTube, the right-click menu and the messages. A new Language setting picks one, or follows the browser.

## [1.0.3]

### Fixed

- The "Watch in SaveTube" button is readable on YouTube's light theme (it had white text on a pale background).
- The thumbnail overlay sits on the thumbnail's corner in list views, and stays open when YouTube's own hover preview starts.
- The settings page and popup use the SaveTube green instead of the old red.

## [1.0.2]

### Changed

- Renamed to SaveTube: the `savetube://` link, the `/savetube/` bridge paths (the desktop app answers as `savetube`), new icon and texts. Based on the Flow extension by A-EDev.
- Links point at the `savetube-desktop` repository.

## [1.0.1]

### Fixed

- Watch-page buttons now render as a full-width bar directly below the player and above the metadata, instead of crowding and wrapping the like/share actions row.
- Thumbnail hover overlay no longer flickers: mouseover events that retarget to the overlay's own Shadow-DOM host are handled, and hiding is debounced.

## [1.0.0]

### Added

- Watch-page button row: **Watch in Flow** / **Download**.
- Hover overlay on video thumbnails across feeds, search, sidebar, playlists, and YouTube Music.
- Right-click context-menu items for video links and watch pages.
- Handoff cascade: silent `127.0.0.1` bridge → `flow://` deep link → "Get Flow" toast.
- Popup with live connection status and quick toggles; full settings page.
- Chromium and Firefox builds from a single source.
- Release packaging and GitHub Actions CI/release pipelines.
