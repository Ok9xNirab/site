const SITE = "https://nirab.me";

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function get() {
  const modules = import.meta.glob("../../posts/**/*.{md,mdx}", { eager: true });

  const posts = Object.values(modules)
    .map((m) => m.frontmatter)
    .filter((f) => f && !f.draft)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

  const items = posts
    .map(
      (f) => `    <item>
      <title>${esc(f.title)}</title>
      <link>${SITE}/post/${esc(f.path)}/</link>
      <guid isPermaLink="true">${SITE}/post/${esc(f.path)}/</guid>
      <description>${esc(f.excerpt)}</description>
      <pubDate>${new Date(f.date).toUTCString()}</pubDate>
${(f.tags ?? []).map((t) => `      <category>${esc(t)}</category>`).join("\n")}
    </item>`
    )
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Istiaq Nirab — Writing</title>
    <link>${SITE}/blog/</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Notes on WordPress, WooCommerce, Laravel, and the bits of full-stack development worth writing down.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return { body };
}
