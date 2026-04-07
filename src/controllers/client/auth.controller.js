import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
import {
  registerNewUser,
  handleLogin,
  handleRefreshToken,
  handleLogout,
} from "../../services/client/auth.services.js";
import {
  getActiveSessions,
  revokeAllUserSessions,
} from "../../services/admin/session.js";
import { COOKIE_OPTIONS } from "../../constants/index.js";

export const register = asyncHandler(async (req, res) => {
  const user = await registerNewUser(req.body);
  return ApiResponse.created(res, user);
});

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const meta = {
    userAgent: req.headers["user-agent"],
    ipAddress: req.ip,
  };

  const { access_token, refresh_token } = await handleLogin(
    username,
    password,
    meta,
  );
  res.cookie("refresh_token", refresh_token, COOKIE_OPTIONS);

  return ApiResponse.success(
    res,
    { access_token },
    {
      message: `Chào mừng ${username} đến với hệ thống`,
    },
  );
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refresh_token;
  await handleLogout(token);
  res.clearCookie("refresh_token", COOKIE_OPTIONS);
  return ApiResponse.deleted(res, "Đăng xuất thành công");
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refresh_token;
  const { access_token } = await handleRefreshToken(token);
  return ApiResponse.success(res, { access_token });
});

export const getSessions = asyncHandler(async (req, res) => {
  const sessions = await getActiveSessions(req.user.id);
  return ApiResponse.success(res, { sessions });
});

export const logoutAll = asyncHandler(async (req, res) => {
  await revokeAllUserSessions(req.user.id);
  res.clearCookie("refresh_token", COOKIE_OPTIONS);
  return ApiResponse.deleted(res, "Đăng xuất tất cả thiết bị thành công");
});
