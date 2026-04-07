import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
import {
  getUserById,
  updateUserProfile,
  changeUserPassword,
} from "../../services/client/user.services.js";

export const fetchAccount = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id);
  return ApiResponse.success(res, user);
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const avatar = req.file?.filename
    ? `/avatars/${req.file.filename}`
    : undefined;
  const user = await updateUserProfile(req.user.id, {
    ...req.validated.body,
    avatar,
  });
  return ApiResponse.updated(res, user);
});

export const changePassword = asyncHandler(async (req, res) => {
  await changeUserPassword(req.user.id, req.validated.body);
  return ApiResponse.deleted(res, "Đổi mật khẩu thành công");
});
