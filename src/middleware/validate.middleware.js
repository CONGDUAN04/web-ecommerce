export const validate = (schema) => async (req, res, next) => {
    try {
        console.log("BEFORE VALIDATE req.query =", req.query);
        console.log("BEFORE VALIDATE req.body =", req.body);
        console.log("BEFORE VALIDATE req.params =", req.params);
        const result = await schema.safeParseAsync({
            params: req.params,
            query: req.query,
            body: req.body,
        });
        if (!result.success) {
            const fieldErrors = new Map();

            result.error.issues.forEach((item) => {
                const field = item.path.join(".");
                if (!fieldErrors.has(field)) {
                    fieldErrors.set(field, item.message);
                }
            });
            return res.status(400).json({
                data: null,
                message: "Dữ liệu không hợp lệ",
                errors: Array.from(fieldErrors, ([field, message]) => ({
                    field,
                    message,
                })),
            });
        }

        req.validated = result.data; // dữ liệu đã clean
        next();
    } catch (error) {
        next(error);
    }
};
