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
    <div>
      <div class="searchwrap">
        <input
          onInput={(e) => setInput(e.target.value)}
          type="search"
          placeholder="Search posts — titles, excerpts"
          aria-label="Search posts"
        />
      </div>
      <div class="blogrows">
        {resultPosts.map((post) => (
          <Item {...post.item} />
        ))}
      </div>
    </div>
  );
};

export default Search;
