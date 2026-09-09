// Site content — Istiaq Nirab.

export const PROFILE = {
  name: "Istiaq Nirab",
  short: "Istiaq",
  role: "Full stack + AI engineer",
  place: "Dhaka, BD",
  tz: "GMT+6",
  years: "5+",
  intro:
    "I build products end to end — nine WooCommerce plugins live on wordpress.org, and increasingly the AI layers that make products useful.",
};

export const SOCIALS = [
  { label: "github", handle: "ok9xnirab", url: "https://github.com/ok9xnirab" },
  { label: "linkedin", handle: "ok9xnirab", url: "https://bd.linkedin.com/in/ok9xnirab" },
  { label: "dev.to", handle: "ok9xnirab", url: "https://dev.to/ok9xnirab" },
  { label: "x", handle: "Ok9xNirab", url: "https://twitter.com/Ok9xNirab" },
];

export const DISCIPLINES = [
  {
    id: "fullstack",
    title: "Full stack engineering",
    line: "One person, whole product. Schema to ship.",
    body: "<strong>Django</strong>, <strong>FastAPI</strong>, <strong>Laravel</strong>, <strong>NestJS</strong> and <strong>Next.js</strong> — chosen per problem, not per habit. I own the parts nobody volunteers for: migrations, billing edge cases, queues, deploys.",
    items: ["Product architecture", "API + data modelling", "React / Next.js front ends", "Payments & billing", "Queues, jobs, realtime", "CI/CD, observability"],
  },
  {
    id: "ai",
    title: "AI engineering",
    line: "Models are cheap. Good AI products are not.",
    body: "Retrieval that actually retrieves, agents with guardrails, evals before launch. AI that survives contact with real users and real latency budgets.",
    items: ["RAG & vector search", "Agentic workflows", "Evals & guardrails", "Streaming UX", "Fine-tuning / distillation", "Cost & latency budgets"],
  },
  {
    id: "wp",
    title: "WordPress plugin development",
    line: "Nine plugins on wordpress.org. 14,000+ installs.",
    body: "WooCommerce extensions that survive core updates, security review and merchants doing unexpected things. Written to the plugin handbook, not around it.",
    items: ["WooCommerce extensions", "Plugin API & hooks", "Gutenberg blocks", "WP REST API", "WP-CLI tooling", "wordpress.org review"],
  },
];

export const STACK = [
  { group: "Languages", items: ["PHP", "Python", "TypeScript", "JavaScript", "SQL"] },
  { group: "WordPress", items: ["Plugin API", "WooCommerce", "WP-CLI", "REST API", "Gutenberg", "Action Scheduler", "Elementor"] },
  { group: "Web stack", items: ["Laravel", "Livewire", "Django", "FastAPI", "NestJS", "Next.js", "React", "Tailwind", "Alpine.js"] },
  { group: "AI", items: ["OpenAI API", "LangChain", "LangGraph", "RAG & embeddings", "pgvector", "Evals"] },
  { group: "Data", items: ["MySQL", "PostgreSQL", "Redis", "NumPy", "Pandas"] },
  { group: "AWS", items: ["EC2", "Lambda", "RDS", "Aurora", "ElasticSearch", "S3", "Route53", "VPC", "IAM", "CloudFront", "SQS / SNS", "CloudWatch"] },
  { group: "Infra", items: ["Docker", "GitHub Actions", "Composer", "PHPUnit / Pest"] },
];

export const PLUGINS = [
  { name: "SaleMint – Paddle Checkout for WooCommerce", slug: "salemint-paddle-checkout", blurb: "Accept payments via Paddle as a WooCommerce checkout gateway — merchant of record handled for you.", url: "https://salemint.io/plugins/paddle-for-woocommerce", tag: "Payments" },
  { name: "Subscription for WooCommerce", slug: "subscription", blurb: "Recurring subscriptions on any WooCommerce product — plans, renewals, mid-cycle changes.", url: "https://wordpress.org/plugins/subscription/", tag: "Recurring" },
  { name: "Pre Order Addon for WooCommerce", slug: "pre-order", blurb: "Advance orders and backorders with release dates, partial payment and stock rules.", url: "https://wordpress.org/plugins/wc-pre-order/", tag: "Commerce" },
  { name: "Booking for WooCommerce", slug: "booking", blurb: "Available dates and time slots on products and services, with capacity per slot.", url: "https://wordpress.org/plugins/wc-booking/", tag: "Scheduling" },
  { name: "PDF Invoices & Packing Slips", slug: "invoice", blurb: "Generate, print and email PDF invoices and packing slips automatically per order status.", url: "https://wordpress.org/plugins/pdf-invoices-and-packing-slips/", tag: "Documents" },
  { name: "Checkout Field Customizer", slug: "cfc", blurb: "Add, remove and reorder checkout fields with drag and drop — no template overrides.", url: "https://wordpress.org/plugins/checkout-field-customizer/", tag: "Checkout" },
  { name: "Advance Coupons for WooCommerce", slug: "coupon", blurb: "Gift vouchers, store credit and spend-based discounts beyond stock coupon logic.", url: "https://wordpress.org/plugins/advance-coupons-for-woocommerce/", tag: "Discounts" },
  { name: "Bulk Product Selling", slug: "bpselling", blurb: "Sell many products as one grouped item at a shared price — bundles without the maths.", url: "https://wordpress.org/plugins/bulk-products-selling/", tag: "Bundles" },
  { name: "WC SMS Notification", slug: "sms", blurb: "Automated SMS for order status changes, to customer and admin, with per-gateway routing.", url: "https://wordpress.org/plugins/wc-sms-notification/", tag: "Messaging" },
  { name: "Social Sharing Button", slug: "social", blurb: "Lightweight share buttons for product pages. No external trackers, no jQuery.", url: "https://wordpress.org/plugins/product-sharing-buttons/", tag: "Sharing" },
];

export const CATEGORIES = ["PHP"];
