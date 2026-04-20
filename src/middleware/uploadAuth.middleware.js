import { UPLOAD_TYPES } from "../constants/uploadFolder.js";
import { ROLE } from "../constants/index.js";

export const uploadAuth = (req, res, next) => {
  const { type } = req.body;

  if (!type) {
    return res.status(400).json({ message: "Thiếu loại upload" });
  }

  const config = UPLOAD_TYPES[type];

  if (!config) {
    return res.status(400).json({ message: "Loại upload không hợp lệ" });
  }

  if (config.requiresAdmin && req.user.role !== ROLE.ADMIN) {
    return res.status(403).json({
      message: "Bạn không có quyền upload loại này",
    });
  }

  next();
};
