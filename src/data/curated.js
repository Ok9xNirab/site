// Placeholder curated content — tools, reads and talks worth keeping.

export const CURATED_CATEGORIES = [
  {
    slug: "tools",
    title: "Tools",
    desc: "Things I install on a fresh machine before anything else, or reach for often enough to keep a list.",
    items: [
      { title: "PhpStorm", note: "Where all the plugin work actually happens — the WordPress stub integration and Xdebug step-through are worth the license on their own.", source: "jetbrains.com", url: "https://www.jetbrains.com/phpstorm/", date: "2026-07" },
      { title: "Xdebug Key", note: "A small menu bar toggle for switching Xdebug on and off without editing php.ini by hand mid-debug session.", source: "xdebug.org", url: "https://xdebug.org/", date: "2026-07" },
      { title: "TablePlus", note: "The GUI I reach for over wp-cli when I need to eyeball wp_postmeta after a migration went sideways.", source: "tableplus.com", url: "https://tableplus.com/", date: "2026-06" },
      { title: "Warp", note: "A terminal that treats blocks and AI completion as first-class, which matters when you're bouncing between PHP, TS and Python shells all day.", source: "warp.dev", url: "https://www.warp.dev/", date: "2026-06" },
      { title: "Ollama", note: "Running local models to test LangChain and LangGraph flows offline before burning API credits on the real thing.", source: "ollama.com", url: "https://ollama.com/", date: "2026-05" },
      { title: "Anaconda Navigator", note: "Keeps the Python environments for different AI engineering projects from fighting each other over package versions.", source: "anaconda.com", url: "https://www.anaconda.com/download", date: "2026-04" },
      { title: "RapidAPI", note: "Useful for probing a third-party API's actual shape before wiring it into a LangChain tool or a plugin's REST bridge.", source: "rapidapi.com", url: "https://rapidapi.com/", date: "2026-03" },
      { title: "GitHub Desktop", note: "Not my daily driver for commits, but the fastest way to review a messy diff before it goes into a PR.", source: "desktop.github.com", url: "https://desktop.github.com/", date: "2026-02" },
      { title: "Zed", note: "Fast enough that it's become the default for quick edits and one-off scripts where PhpStorm would be overkill.", source: "zed.dev", url: "https://zed.dev/", date: "2026-02" },
      { title: "Claude", note: "Where most of the LangChain and LangGraph design thinking happens before a single line gets written — pairing on architecture, not just code.", source: "claude.ai", url: "https://claude.ai/", date: "2026-08" },
      { title: "VS Code", note: "The default for TypeScript and Python work — Copilot-adjacent extensions and a lighter footprint than PhpStorm when I'm not touching PHP.", source: "code.visualstudio.com", url: "https://code.visualstudio.com/", date: "2026-05" },
      { title: "Brave Browser", note: "Daily browsing and quick DevTools checks, kept separate from the profile I use for client staging logins.", source: "brave.com", url: "https://brave.com/", date: "2026-01" },
    ],
  },
  {
    slug: "reads",
    draft: true,
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
    draft: true,
    title: "Talks & videos",
    desc: "Talks I've rewatched more than once, which is the only metric that matters for this list.",
    items: [
      { title: "Debugging as a discipline, not a talent", note: "Reframed how I mentor juniors on incident response — process over pattern-matching.", source: "talk", url: "#", date: "2026-01" },
      { title: "What a database actually promises you", note: "The clearest explanation of isolation levels I've seen delivered out loud.", source: "recorded talk", url: "#", date: "2025-09" },
    ],
  },
  {
    slug: "threads",
    draft: true,
    title: "Threads & discussions",
    desc: "Forum threads and long comment sections worth the twenty minutes, saved before they inevitably get buried.",
    items: [
      { title: "Why this ORM's lazy loading footgun keeps coming back", note: "A maintainer thread that's more honest about tradeoffs than the documentation.", source: "discussion thread", url: "#", date: "2026-06" },
      { title: "The 'boring technology' debate, one more round", note: "The best-argued version of this recurring argument I've seen, from both sides.", source: "forum thread", url: "#", date: "2026-03" },
    ],
  },
];
