import { CASES } from "../data/cases.js";
import { CURATED_CATEGORIES } from "../data/curated.js";

const SITE = "https://nirab.me";

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function get() {
  const posts = import.meta.glob("../../posts/**/*.{md,mdx}", { eager: true });
  const entries = [];

  const add = (path, { changefreq = "monthly", priority = "0.6", lastmod } = {}) =>
    entries.push({ loc: `${SITE}${path}`, changefreq, priority, lastmod });

  add("/", { changefreq: "monthly", priority: "1.0" });
  add("/work/", { priority: "0.9" });
  add("/blog/", { changefreq: "weekly", priority: "0.9" });
  add("/plugins/", { priority: "0.8" });
  add("/curated/", { priority: "0.7" });
  add("/about/", { priority: "0.7" });
  add("/contact/", { priority: "0.7" });

  for (const c of CASES) add(`/work/${c.slug}/`, { priority: "0.8" });
  for (const c of CURATED_CATEGORIES.filter((c) => !c.draft))
    add(`/curated/${c.slug}/`, { priority: "0.6" });

  const live = Object.values(posts)
    .map((m) => m.frontmatter)
    .filter((f) => f && !f.draft);

  for (const f of live)
    add(`/post/${f.path}/`, {
      priority: "0.8",
      lastmod: new Date(f.date).toISOString().slice(0, 10),
    });

  const tags = [...new Set(live.flatMap((f) => f.tags ?? []))];
  for (const t of tags) add(`/tag/${encodeURIComponent(t)}/`, { priority: "0.4" });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${esc(e.loc)}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ""}
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  return { body };
}
