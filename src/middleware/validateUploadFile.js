import { ValidationError } from "../utils/AppError.js";

const ALLOWED_TYPES = ["image/png", "image/jpg", "image/jpeg"];
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

export const validateFileMetadata = (fileData) => {
  const errors = [];

  // Check size
  if (fileData.size > MAX_FILE_SIZE) {
    errors.push({
      field: "file",
      message: "File quá lớn. Max 3MB",
    });
  }

  // Check MIME type
  if (!ALLOWED_TYPES.includes(fileData.mimetype)) {
    errors.push({
      field: "file",
      message: "Chỉ cho phép hình ảnh JPEG, PNG, WebP",
    });
  }

  if (errors.length > 0) {
    const err = new ValidationError("File không hợp lệ");
    err.errors = errors;
    throw err;
  }
};
