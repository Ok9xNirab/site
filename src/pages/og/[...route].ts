import fs from "node:fs";
import path from "node:path";
import { OGImageRoute } from "astro-og-canvas";
import { OG_BY_SLUG } from "../../data/og.js";

// Design tokens, mirrored from src/styles/global.css.
const INK: [number, number, number] = [18, 18, 15];
const INK2: [number, number, number] = [104, 104, 95];
const WASH: [number, number, number] = [247, 247, 245];
const ACCENT: [number, number, number] = [0, 106, 202];

// astro-og-canvas only accepts font URLs and fetches them. Remote fetches made
// the build flaky (a failed fetch hangs its loader and the build exits early
// with no images), so the fonts are vendored and handed over as data URLs.
const fontUrl = (file: string) => {
  const buf = fs.readFileSync(path.resolve("src/assets/fonts", file));
  return `data:font/ttf;base64,${buf.toString("base64")}`;
};

const JETBRAINS = [fontUrl("jetbrains-mono-500.ttf"), fontUrl("jetbrains-mono-400.ttf")];

export const { getStaticPaths, get } = OGImageRoute({
  param: "route",
  // Already keyed by the slug this route serves, so the key is the slug.
  pages: OG_BY_SLUG,
  getSlug: (slug) => slug,
  getImageOptions: (_slug, page: { title: string; description: string }) => ({
    title: page.title,
    description: page.description,
    bgGradient: [WASH],
    border: { color: ACCENT, width: 18, side: "inline-start" },
    padding: 70,
    fonts: JETBRAINS,
    font: {
      title: { color: INK, size: 62, lineHeight: 1.15, weight: "Medium", families: ["JetBrains Mono"] },
      description: { color: INK2, size: 30, lineHeight: 1.4, families: ["JetBrains Mono"] },
    },
  }),
});
