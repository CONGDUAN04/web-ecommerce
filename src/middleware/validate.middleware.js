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
                const field = item.path
                    .filter((p) => !["body", "params", "query"].includes(p))
                    .join(".");

                if (!fieldErrors.has(field)) {
                    fieldErrors.set(field, item.message);
                }
            });

            return res.status(422).json({
                ErrorCode: 1,
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