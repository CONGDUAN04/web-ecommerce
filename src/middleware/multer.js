import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_TYPES = ["image/png", "image/jpg", "image/jpeg"];
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

export class FileTypeError extends Error {
    constructor(fieldname) {
        super("Chỉ cho phép hình ảnh JPEG và PNG");
        this.field = fieldname;
    }
}

const fileFilter = (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new FileTypeError(file.fieldname), false);
    }
};

const createStorage = (dir) =>
    multer.diskStorage({
        destination: `public/${dir}`,
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${uuidv4()}${ext}`);
        },
    });

const createUploader = (dir) =>
    multer({
        storage: createStorage(dir),
        limits: { fileSize: MAX_FILE_SIZE },
        fileFilter,
    });

export const uploadSingleFile = (fieldName, dir = "images") => {
    const upload = createUploader(dir).single(fieldName);

    return (req, res, next) => {
        upload(req, res, (err) => {
            if (!err) return next();

            if (err instanceof multer.MulterError) {
                const message = err.code === "LIMIT_FILE_SIZE"
                    ? "Dung lượng ảnh tối đa là 3MB"
                    : err.message;

                return res.status(400).json({
                    ErrorCode: 1,
                    message: "Upload ảnh thất bại",
                    errors: [{ field: err.field ?? fieldName, message }]
                });
            }

            if (err instanceof FileTypeError) {
                return res.status(400).json({
                    ErrorCode: 1,
                    message: "Dữ liệu không hợp lệ",
                    errors: [{ field: err.field, message: err.message }]
                });
            }

            next(err);
        });
    };
};

export const uploadMultipleFields = (dir = "images") => {
    const upload = createUploader(dir).fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "colorImages", maxCount: 20 },
    ]);

    return (req, res, next) => {
        upload(req, res, (err) => {
            if (!err) return next();

            if (err instanceof multer.MulterError) {
                const message = err.code === "LIMIT_FILE_SIZE"
                    ? "Dung lượng ảnh tối đa là 3MB"
                    : err.message;

                return res.status(400).json({
                    ErrorCode: 1,
                    message: "Upload ảnh thất bại",
                    errors: [{ field: err.field ?? "file", message }]
                });
            }

            if (err instanceof FileTypeError) {
                return res.status(400).json({
                    ErrorCode: 1,
                    message: "Dữ liệu không hợp lệ",
                    errors: [{ field: err.field, message: err.message }]
                });
            }

            next(err);
        });
    };
};