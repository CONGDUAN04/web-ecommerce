import {
  getUserById,
  updateUserProfile,
  changeUserPassword,
} from "../../services/client/user.services.js";

const handleError = (res, error, statusCode = 400) => {
  return res.status(statusCode).json({ ErrorCode: 1, message: error.message });
};

// GET /api/v1/me
export const fetchAccount = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy thông tin tài khoản thành công",
      data: user,
    });
  } catch (error) {
    return handleError(res, error, 404);
  }
};

// PATCH /api/v1/me
export const updateMyProfile = async (req, res) => {
  try {
    const avatar = req.file?.filename
      ? `/avatars/${req.file.filename}`
      : undefined;

    const user = await updateUserProfile(req.user.id, {
      ...req.validated.body,
      avatar,
    });

    return res.status(200).json({
      ErrorCode: 0,
      message: "Cập nhật thông tin thành công",
      data: user,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// PATCH /api/v1/me/change-password
export const changePassword = async (req, res) => {
  try {
    await changeUserPassword(req.user.id, req.validated.body);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    return handleError(res, error);
  }
};
