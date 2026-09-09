import { OG_BY_SLUG } from "../../data/og.js";
import { PROFILE } from "../../data/site.js";
import { renderCard } from "../../utils/ogCard.js";

export function getStaticPaths() {
  return Object.keys(OG_BY_SLUG).map((slug) => ({ params: { route: slug } }));
}

export async function get({ params }: { params: { route?: string } }) {
  const page = OG_BY_SLUG[params.route ?? ""];
  if (!page) return new Response("Not found", { status: 404 });

  return {
    body: await renderCard({
      title: page.title,
      description: page.description,
      author: PROFILE.name,
      site: `nirab.me · ${PROFILE.role}`,
    }),
  };
}
