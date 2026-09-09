// Case studies — real client work.

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

export const CASES = [
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
];
