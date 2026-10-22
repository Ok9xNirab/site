// Case studies — client work and my own products.

const mk = (o) =>
  Object.assign(
    {
      year: "2025",
      role: "Lead full stack engineer",
      duration: "5 months",
      team: "Solo",
      links: [],
    },
    o
  );

const ALL = [
  mk({
    slug: "soundcloudplace",
    n: "01",
    title: "SoundCloudPlace",
    sub: "Social growth marketplace",
    category: "PHP",
    stack: ["Laravel", "MySQL", "Vue", "Bootstrap", "PayPal"],
    year: "2024",
    duration: "1 month",
    team: "Solo",
    role: "Full stack engineer",
    client: "Omar Faruque",
    blurb: "A storefront and admin for buying social growth packages — likes, views, streams and followers across six platforms — built for client Omar Faruque.",
    metrics: [
      { v: "6", l: "platforms sold" },
      { v: "40+", l: "packages configured" },
      { v: "0", l: "code changes to add a platform" },
    ],
    overview: "SoundCloudPlace sells growth packages — likes, views, streams, followers — across Facebook, YouTube, Spotify, Soundcloud, Instagram and TikTok. Rather than hardcoding six product pages, the whole storefront is driven by a small set of admin-managed tables: platforms contain groups, groups contain packages and the order form fields those packages need. Adding a seventh platform is a content operation, not a deploy.",
    problem: [
      "Every platform sells a different shape of thing — a video URL, a profile link, a track link — so the order form itself had to be configurable per package, not fixed in code.",
      "Prices and package contents change often; a completed order still needs to show exactly what the customer bought and paid for, even after the live package is edited or removed later.",
      "The client needed to run this alone from an admin panel — creating platforms, groups, packages and FAQs — without ever touching code.",
    ],
    approach: [
      { h: "Content as data, not templates", p: "Platforms, groups and packages are plain Eloquent models the admin edits directly. The storefront and the order form render entirely from that data, so a new platform or package is a form submission, not a pull request." },
      { h: "Order forms defined per group", p: "Each group owns a set of form fields (text, url, email, select…) that render dynamically on the order page and validate against what that specific package actually needs — a YouTube view package asks for a video URL, a Spotify package for a track link." },
      { h: "Orders keep a receipt, not a reference", p: "Placing an order snapshots the package's title, price and features into a package_snap row before creating the transaction. Later edits to the live package can't retroactively change what a customer was already sold." },
    ],
    results: "The client runs the full catalog — platforms, groups, packages, pricing and FAQs — from the admin dashboard without engineering involvement. Orders flow through PayPal checkout with status tracking (processing, on-hold, completed) and email notifications on status change, giving the client a simple support workflow for every transaction.",
    gallery: [
      { id: "scp-1", cap: "storefront — homepage & services", img: "/work/soundcloudplace/home.png" },
      { id: "scp-2", cap: "platform page — Facebook packages", img: "/work/soundcloudplace/platform-facebook.png" },
      { id: "scp-3", cap: "order form — dynamic per-package fields", img: "/work/soundcloudplace/order.png" },
      { id: "scp-4", cap: "admin dashboard — groups management", img: "/work/soundcloudplace/admin-dashboard.png" },
    ],
  }),
  mk({
    slug: "myself",
    n: "02",
    title: "MySelf",
    sub: "Personal productivity app for macOS",
    category: "Swift",
    stack: ["Swift", "SwiftUI", "iCloud Drive", "SwiftMath"],
    year: "2026",
    duration: "Ongoing",
    team: "Solo",
    role: "Designer and engineer",
    blurb: "One native Mac app for todos, notes, university classes, office tasks, interview prep and Kanban boards — open source and synced between Macs over iCloud Drive.",
    metrics: [
      { v: "7", l: "sections in one window" },
      { v: "0", l: "accounts or servers" },
      { v: "1", l: "JSON file per record" },
    ],
    overview: "MySelf replaces the five apps I was using to run my week: a todo list, a notes app, a Kanban board, a study tracker and a class calendar. It's a native SwiftUI app with a Dashboard that pulls what's due today from every section into one list. There's no account and no backend: every item is a small JSON file in a folder you choose, and iCloud Drive moves those files between Macs.",
    problem: [
      "Sync without a server or a paid Apple developer account. CloudKit needs an entitlement that needs a paid membership, and I didn't want to run a backend for a personal app.",
      "Seven very different sections — a block editor with LaTeX and code, Kanban boards, a revision tracker, a class schedule — had to feel like one app, not seven mini-apps stitched together.",
      "Not everyone needs every section, so each one has to be removable from the sidebar, Dashboard, search and shortcuts without losing its data.",
    ],
    approach: [
      { h: "A folder is the database", p: "Every todo, note, class, card and label is saved as its own pretty-printed JSON file, <folder>/<id>.json. Edits to different records on two Macs can never conflict, deleting a record is removing a file, and if the same record changed on both Macs the newer updatedAt wins." },
      { h: "Sync through iCloud Drive, not CloudKit", p: "The user picks a folder in iCloud Drive once per Mac, kept across launches with a security-scoped bookmark. A file presenter, app activation and a slow poll (faster while files are still uploading) trigger re-reads, and a modified-date cache means only changed files are decoded again." },
      { h: "One design system, keyboard-first", p: "Shared cards, badges, chips and progress views keep every section consistent, and the app follows macOS light/dark mode and accent colour. ⌘K opens Quick Open, ⌥⌘K opens a Spotlight-style search panel from any app, and every page has a shortcut." },
      { h: "Features as switches", p: "Each section can be turned off in Settings › Features. It disappears from the sidebar, Dashboard, search and shortcuts, but its files stay on disk, so turning it back on restores everything." },
    ],
    results: "MySelf is my daily driver and is open source under MIT. It ships as a universal DMG for Apple Silicon and Intel through GitHub Releases, checks GitHub for updates once a day, and keeps todos, office tasks, notes, University, Job Study and Product Dev in sync across my Macs. Workout tracking is next on the roadmap.",
    links: [
      { label: "Source on GitHub", url: "https://github.com/Ok9xNirab/myself" },
      { label: "Download the DMG", url: "https://github.com/Ok9xNirab/myself/releases/latest" },
    ],
    gallery: [
      { id: "ms-1", cap: "dashboard — today's focus across every section", img: "/work/myself/dashboard.png" },
      { id: "ms-2", cap: "todos — priorities, labels and due dates", img: "/work/myself/todos.png" },
      { id: "ms-3", cap: "university — classes, exams and syllabus progress", img: "/work/myself/university.png" },
      { id: "ms-4", cap: "notes — block editor with LaTeX and code", img: "/work/myself/notes.png" },
      { id: "ms-5", cap: "job study — revision tracking per topic", img: "/work/myself/job-study.png" },
      { id: "ms-6", cap: "product dev — Kanban board per product", img: "/work/myself/product-dev.png" },
      { id: "ms-7", cap: "office tasks — work items with reference links", img: "/work/myself/office-tasks.png" },
    ],
  }),
  mk({
    slug: "glance",
    n: "03",
    title: "Glance",
    sub: "Git client for reviewing AI agents' work on macOS",
    category: "Swift",
    stack: ["Swift", "SwiftUI", "git", "tree-sitter", "FSEvents"],
    year: "2026",
    duration: "Ongoing",
    team: "Solo",
    role: "Designer and engineer",
    blurb: "A native Mac git client for reviewing what Claude Code, Codex, Copilot and other coding agents change, across every repository, worktree and branch in one window.",
    metrics: [
      { v: "1", l: "window for every worktree" },
      { v: "0", l: "commits made by Glance" },
      { v: "0", l: "accounts, servers or tracking" },
    ],
    overview: "When several coding agents work at once, each in its own git worktree, keeping up with what they changed means jumping between terminals, git diff and an editor. Glance puts every repository, worktree and branch in one sidebar. You read each agent's changes as they happen, mark files as reviewed, throw away the hunks you don't want, and hand the rest back to the agent to commit.",
    problem: [
      "Agents write files constantly and in parallel. A review tool that needs a refresh button, or only knows about one checkout, falls behind the moment there are three worktrees.",
      "Reviewing is not committing. If the tool stages and commits for you, it fights the agent over git state, and merge conflicts end up in the wrong hands.",
      "It had to run the user's own git, with their config, hooks and credentials, and still feel instant on large repositories.",
    ],
    approach: [
      { h: "Read .git directly, write through git", p: "Worktrees, branches and the remote are read straight from the files in .git, which is much quicker than running git on every refresh. Anything that writes, such as discarding a hunk or pushing, runs /usr/bin/git, so the user's config, hooks and credentials apply." },
      { h: "Live without polling", p: "An FSEvents watcher re-reads a worktree's changes whenever its files, index or HEAD change, so diffs appear while the agent is still writing. Each window keeps its own models per worktree, so switching with ⌘K is instant." },
      { h: "The agent stays in charge of git", p: "Glance doesn't commit, fetch, pull or merge. You mark files as viewed, and Copy commit prompt gives the agent a prompt to commit only those. Discarding a hunk applies a one-hunk reverse patch, and ⌘Z writes the old contents back." },
      { h: "Know which agent did what", p: "History reads the newest 500 commits, marks the unpushed ones and names the agent from each commit's Co-authored-by trailer. Diffs are syntax-highlighted with tree-sitter in unified or split view." },
    ],
    results: "Glance is open source under MIT and ships as a universal DMG for Apple Silicon and Intel through GitHub Releases. I use it every day to review the agents working across my own repositories. An update check and Developer ID notarization are next on the roadmap.",
    links: [
      { label: "About Glance", url: "https://glance.nirab.me/" },
      { label: "Source on GitHub", url: "https://github.com/Ok9xNirab/Glance" },
      { label: "Download the DMG", url: "https://github.com/Ok9xNirab/Glance/releases/latest" },
    ],
    gallery: [
      { id: "gl-1", cap: "changes — worktrees, changed files and a syntax-highlighted diff", img: "/work/glance/changes.png" },
    ],
  }),
];

// Newest first.
export const CASES = ALL.sort((a, b) => b.n.localeCompare(a.n));
