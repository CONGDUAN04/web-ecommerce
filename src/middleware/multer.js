import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_TYPES = ["image/png", "image/jpg", "image/jpeg"];
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

const fileFilter = (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        const error = new Error("Chỉ cho phép hình ảnh JPEG và PNG");
        error.field = file.fieldname;
        cb(error, false);
    }
};

// 🔹 Storage
const createStorage = (dir) =>
    multer.diskStorage({
        destination: `public/${dir}`,
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${uuidv4()}${ext}`);
        },
    });

// 🔹 Upload 1 file
export const uploadSingleFile = (fieldName, dir = "images") =>
    multer({
        storage: createStorage(dir),
        limits: { fileSize: MAX_FILE_SIZE },
        fileFilter,
    }).single(fieldName);

// 🔹 Upload nhiều field
export const uploadMultipleFields = (dir = "images") =>
    multer({
        storage: createStorage(dir),
        limits: { fileSize: MAX_FILE_SIZE },
        fileFilter,
    }).fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "colorImages", maxCount: 20 },
    ]);
