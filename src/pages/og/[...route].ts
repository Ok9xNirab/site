import fs from "node:fs";
import path from "node:path";
import { OGImageRoute } from "astro-og-canvas";

// Every published post, keyed by its own frontmatter slug so the generated
// image URL mirrors the post URL: /post/foo/ -> /og/foo.png
const modules = import.meta.glob("/posts/**/*.{md,mdx}", { eager: true }) as Record<
  string,
  { frontmatter: { title: string; excerpt?: string; path: string; draft?: boolean } }
>;

const pages = Object.fromEntries(
  Object.entries(modules).filter(([, m]) => !m.frontmatter.draft)
);

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
  pages,
  getSlug: (_path, page) => `${page.frontmatter.path}.png`,
  getImageOptions: (_path, page) => ({
    title: page.frontmatter.title,
    description: page.frontmatter.excerpt ?? "",
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
