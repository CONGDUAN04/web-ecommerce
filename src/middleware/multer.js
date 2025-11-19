import multer from "multer";
import path from "path";
import { v4 } from "uuid";

const fileUploadMiddleware = (fieldName, dir = "images") => {
    return multer({
        storage: multer.diskStorage({
            destination: "public/" + dir,
            filename: (req, file, cb) => {
                const extension = path.extname(file.originalname);
                cb(null, v4() + extension);
            },
        }),
        limits: {
            fileSize: 1024 * 1024 * 3,
        },
        fileFilter: (req, file, cb) => {
            if (
                file.mimetype === "image/png" ||
                file.mimetype === "image/jpg" ||
                file.mimetype === "image/jpeg"
            ) {
                cb(null, true);
            } else {
                cb(new Error("Chỉ cho phép hình ảnh JPEG và PNG"), false);
            }
        },
    }).single(fieldName);
};

export default fileUploadMiddleware;
