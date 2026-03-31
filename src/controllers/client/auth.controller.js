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
import { COOKIE_OPTIONS } from "../../config/constant.js";

// POST /api/v1/auth/register
export const register = async (req, res) => {
  try {
    const user = await registerNewUser(req.body);
    return res.status(201).json({
      ErrorCode: 0,
      message: "Đăng ký thành công",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({ ErrorCode: 1, message: error.message });
  }
};

// POST /api/v1/auth/login
export const login = async (req, res) => {
  try {
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

    return res.status(200).json({
      ErrorCode: 0,
      message: `Chào mừng ${username} đến với hệ thống`,
      data: { access_token },
    });
  } catch (error) {
    return res.status(401).json({ ErrorCode: 1, message: error.message });
  }
};

// POST /api/v1/auth/logout
export const logout = async (req, res) => {
  try {
    const token = req.cookies?.refresh_token;
    await handleLogout(token);
    res.clearCookie("refresh_token", COOKIE_OPTIONS);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    return res.status(400).json({ ErrorCode: 1, message: error.message });
  }
};

// POST /api/v1/auth/refresh-token
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refresh_token;
    const { access_token } = await handleRefreshToken(token);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Làm mới token thành công",
      data: { access_token },
    });
  } catch (error) {
    return res.status(401).json({ ErrorCode: 1, message: error.message });
  }
};

// GET /api/v1/auth/sessions
export const getSessions = async (req, res) => {
  try {
    const sessions = await getActiveSessions(req.user.id);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy danh sách session thành công",
      data: { sessions },
    });
  } catch (error) {
    return res.status(400).json({ ErrorCode: 1, message: error.message });
  }
};

// POST /api/v1/auth/logout-all
export const logoutAll = async (req, res) => {
  try {
    await revokeAllUserSessions(req.user.id);
    res.clearCookie("refresh_token", COOKIE_OPTIONS);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Đăng xuất tất cả thiết bị thành công",
    });
  } catch (error) {
    return res.status(400).json({ ErrorCode: 1, message: error.message });
  }
};
