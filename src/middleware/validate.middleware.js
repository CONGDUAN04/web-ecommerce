import { ValidationError } from "../utils/AppError.js";

export const validate = (schema) => async (req, res, next) => {
  const result = await schema.safeParseAsync({
    params: req.params,
    query: req.query,
    body: req.body ?? {},
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

    const err = new ValidationError("Dữ liệu không hợp lệ");
    err.errors = Array.from(fieldErrors, ([field, message]) => ({
      field,
      message,
    }));

    return next(err);
  }

  req.validated = result.data;
  next();
};
