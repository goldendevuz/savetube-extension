import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { encodePng } from "./png.mjs";
import { flattenPath, bounds, rasterize } from "./svg-raster.mjs";

const SIZES = [16, 48, 128];

// The SaveTube logo: a rounded green square with a play button in a ring. The rasteriser fills each
// shape on its own, so the ring is a white disc with a green disc on top of it.
const CONTAINER =
  "M5.25 0H18.75C21.65 0 24 2.35 24 5.25V18.75C24 21.65 21.65 24 18.75 24H5.25C2.35 24 0 21.65 0 18.75V5.25C0 2.35 2.35 0 5.25 0Z";
const RING_OUTER =
  "M4.125 12C4.125 7.651 7.651 4.125 12 4.125C16.349 4.125 19.875 7.651 19.875 12C19.875 16.349 16.349 19.875 12 19.875C7.651 19.875 4.125 16.349 4.125 12Z";
const RING_INNER =
  "M5.625 12C5.625 8.479 8.479 5.625 12 5.625C15.521 5.625 18.375 8.479 18.375 12C18.375 15.521 15.521 18.375 12 18.375C8.479 18.375 5.625 15.521 5.625 12Z";
const TRIANGLE = "M10.125 8.4375V15.5625L16.125 12Z";

const GREEN = [0x10, 0xb9, 0x81];
const WHITE = [0xff, 0xff, 0xff];

const container = flattenPath(CONTAINER);
const ringOuter = flattenPath(RING_OUTER);
const ringInner = flattenPath(RING_INNER);
const triangle = flattenPath(TRIANGLE);
const box = bounds(container);

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
  <path d="${CONTAINER}" fill="#10B981"/>
  <path d="${RING_OUTER}" fill="#FFFFFF"/>
  <path d="${RING_INNER}" fill="#10B981"/>
  <path d="${TRIANGLE}" fill="#FFFFFF"/>
</svg>
`;

export async function generateIcons(dir) {
  await mkdir(dir, { recursive: true });
  for (const size of SIZES) {
    const rgba = rasterize({
      size,
      box,
      layers: [
        { polys: container, color: GREEN },
        { polys: ringOuter, color: WHITE },
        { polys: ringInner, color: GREEN },
        { polys: triangle, color: WHITE },
      ],
    });
    await writeFile(path.join(dir, `${size}.png`), encodePng(size, rgba));
  }
  await writeFile(path.join(dir, "savetube-mark.svg"), LOGO_SVG);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dir = path.join(process.cwd(), "icons");
  await generateIcons(dir);
  console.log(`icons written to ${dir}`);
}
