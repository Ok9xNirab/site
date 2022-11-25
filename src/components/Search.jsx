import { useState } from "preact/hooks";
import Fuse from "fuse.js";
import Item from "@components/posts/Item";

const Search = ({ posts }) => {
  const allposts = [];
  posts.forEach((post) => allposts.push({ ...post.frontmatter }));
  const fuse = new Fuse(allposts, {
    keys: ["title", "excerpt"],
  });
  const [searchInput, setInput] = useState("");
  const resultPosts = fuse.search(searchInput);

  return (
    <div class="bg-white">
      <input
        onInput={(e) => setInput(e.target.value)}
        class="w-full border px-5 py-3"
        type="text"
        placeholder="Search Articles"
      />
      <div class="my-5">
        {resultPosts.map((post) => (
          <Item {...post.item} />
        ))}
      </div>
    </div>
  );
};

export default Search;
