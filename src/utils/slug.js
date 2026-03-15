export const generateSlug = (text) => {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/gi, "d")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
};