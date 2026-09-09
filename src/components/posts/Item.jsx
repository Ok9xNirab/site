import { getShortDate } from "@utils/index";

export default function Item({ date, path, title, excerpt, tags }) {
  return (
    <a href={`/post/${path}/`} class="brow">
      <div class="bt">
        <span class="chip chip-a">{(tags ?? [])[0] ?? "post"}</span>
        <span class="mono" style={{ marginTop: "10px" }}>{getShortDate(date)}</span>
      </div>
      <div>
        <h3 class="h3" style={{ fontSize: "clamp(20px,2vw,26px)" }}>{title}</h3>
        <p class="body" style={{ marginTop: "10px", maxWidth: "40em" }}>{excerpt}</p>
      </div>
    </a>
  );
}
