import { test } from "node:test";
import assert from "node:assert/strict";

import { FOCUS_KEYS, focusCss } from "./focus.js";
import { DEFAULT_SETTINGS } from "./settings.js";

test("nothing is hidden while every option is off", () => {
  assert.equal(focusCss(DEFAULT_SETTINGS), "");
});

test("only the options that are on add a rule", () => {
  const css = focusCss({ ...DEFAULT_SETTINGS, hideComments: true, blackWhite: true });
  assert.match(css, /ytd-comments/);
  assert.match(css, /grayscale/);
  assert.doesNotMatch(css, /masthead/);
});

test("every option has a default and a rule", () => {
  for (const key of FOCUS_KEYS) {
    assert.equal(DEFAULT_SETTINGS[key], false, key);
    assert.ok(focusCss({ [key]: true }).length > 0, key);
  }
  assert.equal(DEFAULT_SETTINGS.disableAutoplay, false);
});
