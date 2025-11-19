import fs from "fs";
export const cleanupFile = (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = function (data) {
        if (res.statusCode >= 400 && req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Lỗi xóa file:", err);
            });
        }
        return originalJson(data);
    };

    next();
};