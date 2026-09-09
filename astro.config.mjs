import { defineConfig } from 'astro/config';

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import mdx from "@astrojs/mdx";

// https://astro.build/config
import image from "@astrojs/image";

// https://astro.build/config
import preact from "@astrojs/preact";


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
  markdown: { rehypePlugins: [rehypeLazyImages] },
  integrations: [tailwind(), mdx(), image(), preact()]
});
