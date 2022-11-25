import { getFormattedDate } from "@utils/index";

export default function Item({ date, path, title, excerpt, tags }) {
  return (
    <a href={`/post/${path}`} class="post-card">
      <div class="post-item__title">
        <h4 class="text-xl leading-normal block mb-6 font-bold">{title}</h4>
      </div>
      <div>
        <p class="leading-6 font-thin text-gray-400 text-sm">{excerpt}</p>
      </div>
      <div class="flex justify-between items-center mt-5">
        <p class="text-sm text-gray-800">
          {tags.map((tag) => (
            <span class="mr-3"># {tag}</span>
          ))}
        </p>
        <p class="text-sm text-gray-800">{getFormattedDate(date)}</p>
      </div>
    </a>
  );
}
