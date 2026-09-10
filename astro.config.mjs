import { defineConfig } from 'astro/config';

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import mdx from "@astrojs/mdx";

// https://astro.build/config
import image from "@astrojs/image";

// https://astro.build/config
import preact from "@astrojs/preact";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";


// Lazy-load and async-decode images inside markdown posts, so content
// images below the fold don't compete with the LCP element.
function rehypeLazyImages() {
  return (tree) => {
    const walk = (node) => {
      if (node.tagName === 'img') {
        node.properties = { loading: 'lazy', decoding: 'async', ...node.properties };
      }
      (node.children ?? []).forEach(walk);
    };
    walk(tree);
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://nirab.me',
  // Extensionless, slash-free URLs: /post/foo, not /post/foo/.
  trailingSlash: 'never',
  build: { format: 'file' },
  // Custom rehype plugins switch off Astro's built-in markdown plugins unless
  // default plugins are extended, which would drop GFM tables and autolinks.
  // remark-math parses $inline$ and $$display$$ in markdown; rehype-katex
  // renders it to static HTML at build time, so no client-side JS is needed.
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeLazyImages, [rehypeKatex, { strict: false }]],
    extendDefaultPlugins: true,
  },
  integrations: [tailwind(), mdx(), image(), preact()]
});
