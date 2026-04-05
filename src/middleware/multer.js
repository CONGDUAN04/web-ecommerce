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

const handleError = (err, fallbackField, maxCount, res, next) => {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Dung lượng ảnh tối đa là 3MB"
        : err.code === "LIMIT_UNEXPECTED_FILE"
          ? `Tối đa ${maxCount} ảnh`
          : err.message;

    return res.status(400).json({
      ErrorCode: 1,
      message: "Upload ảnh thất bại",
      errors: [{ field: err.field ?? fallbackField, message }],
    });
  }

  if (err instanceof FileTypeError) {
    return res.status(400).json({
      ErrorCode: 1,
      message: "Dữ liệu không hợp lệ",
      errors: [{ field: err.field, message: err.message }],
    });
  }

  next(err);
};

// ✅ Upload 1 file duy nhất
export const uploadSingleFile = (fieldName, dir = "images") => {
  const upload = createUploader(dir).single(fieldName);

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (!err) return next();
      handleError(err, fieldName, 1, res, next);
    });
  };
};

export const uploadMultipleFiles = (
  fieldConfig,
  dir = "images",
  maxCount = 10,
) => {
  const isFields = Array.isArray(fieldConfig);
  const upload = isFields
    ? createUploader(dir).fields(fieldConfig)
    : createUploader(dir).array(fieldConfig, maxCount);

  const fallbackField = isFields ? "file" : fieldConfig;

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (!err) return next();
      handleError(err, fallbackField, maxCount, res, next);
    });
  };
};
