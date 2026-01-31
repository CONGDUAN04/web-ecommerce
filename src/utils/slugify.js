export const slugify = (text) => {
    return text
        .toString()
        .normalize("NFD")                 // bỏ dấu tiếng Việt
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
};
