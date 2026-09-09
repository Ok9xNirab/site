// Single source of truth for social-card images.
//
// Every route listed here gets a 1200x630 PNG rendered at build time by
// src/pages/og/[...route].ts, and the layout looks the current pathname up
// here to find it. Adding a route in one place does both jobs.

import { PROFILE } from "./site.js";
import { CASES } from "./cases.js";
import { CURATED_CATEGORIES } from "./curated.js";

const posts = Object.values(import.meta.glob("/posts/**/*.{md,mdx}", { eager: true }))
  .map((m) => m.frontmatter)
  .filter((f) => f && !f.draft);

/**
 * "/work/soundcloudplace/" -> "work-soundcloudplace.png", "/" -> "index.png"
 *
 * Anything outside the URL-safe set collapses to a dash, so a tag containing a
 * space or a slash can't produce a filename the meta tag would fail to address.
 */
export function ogSlug(pathname) {
  const trimmed = pathname.replace(/^\/+|\/+$/g, "");
  const base = trimmed === "" ? "index" : trimmed.replace(/\//g, "-");
  return `${base.replace(/[^A-Za-z0-9._-]+/g, "-")}.png`;
}

const staticPages = [
  {
    path: "/",
    title: "Istiaq Nirab",
    description: "Full stack & AI engineer. I build products end to end.",
  },
  {
    path: "/work/",
    title: "Case studies",
    description: "Products I owned from schema to ship.",
  },
  {
    path: "/blog/",
    title: "Writing",
    description:
      "Notes on WordPress, WooCommerce, Laravel, and the bits of full-stack development worth writing down.",
  },
  {
    path: "/curated/",
    title: "Curated",
    description: "Tools, reads, talks and threads worth keeping — organized by kind, not by date.",
  },
  {
    path: "/plugins/",
    title: "Plugins",
    description:
      "Nine WooCommerce plugins on wordpress.org — open-source, production-ready, actively maintained.",
  },
  { path: "/about/", title: "About", description: PROFILE.intro },
  {
    path: "/contact/",
    title: "Say hi",
    description: "Open for freelance plugin work, WooCommerce builds, and AI engineering projects.",
  },
];

const postPages = posts.map((f) => ({
  path: `/post/${f.path}/`,
  title: f.title,
  description: f.excerpt ?? "",
}));

const casePages = CASES.map((c) => ({
  path: `/work/${c.slug}/`,
  title: c.title,
  description: c.blurb ?? "",
}));

const curatedPages = CURATED_CATEGORIES.filter((c) => !c.draft).map((c) => ({
  path: `/curated/${c.slug}/`,
  title: c.title,
  description: c.desc ?? "",
}));

const tags = [...new Set(posts.flatMap((f) => f.tags ?? []))];
const tagPages = tags.map((tag) => {
  const n = posts.filter((f) => (f.tags ?? []).includes(tag)).length;
  return {
    path: `/tag/${tag}/`,
    title: `#${tag}`,
    description: `${n} ${n === 1 ? "post" : "posts"} on ${tag}.`,
  };
});

export const OG_PAGES = [
  ...staticPages,
  ...postPages,
  ...casePages,
  ...curatedPages,
  ...tagPages,
];

/** Keyed by the slug the image route serves, e.g. "post-typography.png". */
export const OG_BY_SLUG = Object.fromEntries(OG_PAGES.map((p) => [ogSlug(p.path), p]));

/** The generated card for a pathname, or null when that route has none. */
export function ogImageFor(pathname) {
  const slug = ogSlug(pathname);
  return OG_BY_SLUG[slug] ? `/og/${slug}` : null;
}
