import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Chỉ cho phép hình ảnh JPEG và PNG"), false);
    }
};

const createStorage = (dir) => {
    return multer.diskStorage({
        destination: "public/" + dir,
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, uuidv4() + ext);
        },
    });
};

export const uploadSingleFile = (fieldName, dir = "images") => {
    return multer({
        storage: createStorage(dir),
        limits: { fileSize: 3 * 1024 * 1024 },
        fileFilter,
    }).single(fieldName);
};

export const uploadMultipleFields = (dir = "images") => {
    return multer({
        storage: createStorage(dir),
        limits: { fileSize: 3 * 1024 * 1024 },
        fileFilter,
    }).fields([
        { name: "thumbnail", maxCount: 1 },      // sửa tên field
        { name: "colorImages", maxCount: 20 },
    ]);
};

