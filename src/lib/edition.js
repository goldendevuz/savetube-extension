// True in the build made for the Chrome Web Store. That edition has no download actions at all: the store
// does not allow extensions that help download YouTube videos. The full edition is installed by hand.
// `__STORE__` is always set by build.mjs (a plain true or false), so the bundler can drop the unused code.
export const STORE = __STORE__;
