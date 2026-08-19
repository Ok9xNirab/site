// Placeholder curated content — tools, reads and talks worth keeping.

export const CURATED_CATEGORIES = [
  {
    slug: "tools",
    title: "Tools",
    desc: "Things I install on a fresh machine before anything else, or reach for often enough to keep a list.",
    items: [
      { title: "Postgres.app", note: "Local Postgres with none of the setup ceremony. Still the fastest way to spin up a throwaway database.", source: "postgresapp.com", url: "#", date: "2026-05" },
      { title: "Laravel Herd", note: "A local PHP + Laravel environment that just works, no Docker ceremony for a WordPress-adjacent stack.", source: "herd.laravel.com", url: "#", date: "2026-03" },
      { title: "Bruno", note: "An API client that keeps collections as plain files, so they live in git instead of a vendor's cloud.", source: "usebruno.com", url: "#", date: "2026-01" },
      { title: "Query Monitor", note: "The WordPress debug plugin I install before anything else on a new client site.", source: "wordpress.org", url: "#", date: "2025-11" },
    ],
  },
  {
    slug: "reads",
    title: "Reads",
    desc: "Articles and papers that changed how I think about a specific problem, kept here so I stop losing the link.",
    items: [
      { title: "The WordPress Plugin Handbook, cover to cover", note: "Still the highest-signal document for anything that has to pass wordpress.org review.", source: "handbook", url: "#", date: "2026-06" },
      { title: "A philosophy of software design, revisited", note: "The strongest argument I've read for depth over breadth in module design — still shapes how I review PRs.", source: "essay", url: "#", date: "2026-04" },
      { title: "On the impossibility of certain client-side caches", note: "Formalizes an intuition I'd had for years about staleness bounds without ever writing it down.", source: "blog post", url: "#", date: "2026-02" },
    ],
  },
  {
    slug: "talks",
    title: "Talks & videos",
    desc: "Talks I've rewatched more than once, which is the only metric that matters for this list.",
    items: [
      { title: "Debugging as a discipline, not a talent", note: "Reframed how I mentor juniors on incident response — process over pattern-matching.", source: "talk", url: "#", date: "2026-01" },
      { title: "What a database actually promises you", note: "The clearest explanation of isolation levels I've seen delivered out loud.", source: "recorded talk", url: "#", date: "2025-09" },
    ],
  },
  {
    slug: "threads",
    title: "Threads & discussions",
    desc: "Forum threads and long comment sections worth the twenty minutes, saved before they inevitably get buried.",
    items: [
      { title: "Why this ORM's lazy loading footgun keeps coming back", note: "A maintainer thread that's more honest about tradeoffs than the documentation.", source: "discussion thread", url: "#", date: "2026-06" },
      { title: "The 'boring technology' debate, one more round", note: "The best-argued version of this recurring argument I've seen, from both sides.", source: "forum thread", url: "#", date: "2026-03" },
    ],
  },
];
