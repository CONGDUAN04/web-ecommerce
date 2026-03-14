export const validate = (schema) => async (req, res, next) => {
    try {
        const result = await schema.safeParseAsync({
            params: req.params,
            query: req.query,
            body: req.body,
        });

        if (!result.success) {
            const fieldErrors = new Map();

            result.error.issues.forEach((item) => {
                // ✅ Bỏ prefix "body" | "params" | "query"
                const field = item.path
                    .filter((p) => !["body", "params", "query"].includes(p))
                    .join(".");

                // Chỉ lấy lỗi đầu tiên của mỗi field
                if (!fieldErrors.has(field)) {
                    fieldErrors.set(field, item.message);
                }
            });

            return res.status(422).json({ // ✅ 422
                ErrorCode: 1,             // ✅ đồng nhất với các API khác
                message: "Dữ liệu không hợp lệ",
                errors: Array.from(fieldErrors, ([field, message]) => ({
                    field,
                    message,
                })),
            });
        }

        req.validated = result.data;
        next();
    } catch (error) {
        next(error);
    }
};