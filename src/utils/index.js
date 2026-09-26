export const getFormattedDate = (date) =>
    date
        ? new Date(date).toLocaleDateString("en-us", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
        : "";

export const getShortDate = (date) =>
    date ? new Date(date).toISOString().split("T")[0] : "";

// Tag URLs are lowercase so /tag/networking works; the tag keeps its
// original casing for display.
export const tagSlug = (tag) => String(tag).toLowerCase();
