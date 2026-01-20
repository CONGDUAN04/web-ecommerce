import multer from "multer";

export const uploadErrorHandler = (err, req, res, next) => {
    // 🔹 Multer error (size, field count, ...)
    if (err instanceof multer.MulterError) {
        let message = err.message;

        if (err.code === "LIMIT_FILE_SIZE") {
            message = "Dung lượng ảnh tối đa là 3MB";
        }

        return res.status(400).json({
            message: "Upload ảnh thất bại",
            errors: [
                {
                    field: "body.thumbnail",
                    message,
                },
            ],
        });
    }

    if (err.message === "Chỉ cho phép hình ảnh JPEG và PNG") {
        return res.status(400).json({
            message: "Dữ liệu không hợp lệ",
            errors: [
                {
                    field: `body.${err.field || "thumbnail"}`,
                    message: err.message,
                },
            ],
        });
    }

    next(err);
};
