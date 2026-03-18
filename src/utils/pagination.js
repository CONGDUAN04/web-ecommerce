export const parsePagination = ({ page = 1, limit = 10 } = {}) => {
    page = Math.max(1, Number(page));
    limit = Math.min(Math.max(1, Number(limit)), 100);

    return {
        page,
        limit,
        skip: (page - 1) * limit,
    };
};