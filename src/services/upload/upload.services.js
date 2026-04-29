import cloudinary from "../../config/cloudinary.js";
import { UPLOAD_TYPES } from "../../constants/uploadFolder.js";
import { ROLE } from "../../constants/index.js";
import { ValidationError } from "../../utils/AppError.js";

export const generateUploadSignature = (type, user) => {
  if (!UPLOAD_TYPES[type]) {
    throw new ValidationError("Loại upload không hợp lệ");
  }

  const timestamp = Math.round(Date.now() / 1000);

  let public_id = "";

  if (type === "avatar") {
    public_id = `avatar_${user.id}_${Date.now()}`;
  } else {
    public_id = `${type}_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 8)}`;
  }

  // ✅ CHỈ SIGN 3 FIELD
  const paramsToSign = {
    timestamp,
    folder: UPLOAD_TYPES[type].folder,
    public_id,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET,
  );

  return {
    timestamp,
    signature,
    folder: paramsToSign.folder,
    public_id,

    // 👇 KHÔNG SIGN, CHỈ GỬI FE
    allowed_formats: "jpg,png,jpeg",
  };
};
export const deleteFileService = async (publicId, user) => {
  if (!publicId) {
    throw new ValidationError("Thiếu publicId");
  }

  if (user.role === ROLE.ADMIN || user.role === ROLE.SUPER_ADMIN) {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== "ok") {
      throw new ValidationError("Xoá file thất bại");
    }
    return result;
  }

  const isAvatar = publicId.startsWith(`avatar_${user.id}_`);

  if (!isAvatar) {
    throw new ValidationError("Bạn không có quyền xoá file này");
  }

  const result = await cloudinary.uploader.destroy(publicId);

  if (result.result !== "ok") {
    throw new ValidationError("Xoá file thất bại");
  }

  return result;
};
