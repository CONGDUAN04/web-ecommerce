import jwt from "jsonwebtoken";
import { ROLE } from "../constants/index.js";
const checkValidJWT = (req, res, next) => {
  const path = req.originalUrl.replace(/^\/api/, "");

  const whiteList = ["/login", "/register", "/logout", "/refresh-token"];

  const isWhiteList = whiteList.some((route) => path.startsWith(route));
  if (isWhiteList) return next();

  // Kiểm tra token trước try/catch
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      data: null,
      message: "Không có token trong header",
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      data: null,
      message: "Thiếu JWT_SECRET trong server config",
    });
  }

  try {
    const dataDecoded = jwt.verify(token, process.env.JWT_SECRET);

    // Chỉ lưu những field có trong payload
    req.user = {
      id: dataDecoded.id,
      username: dataDecoded.username,
      fullName: dataDecoded.fullName,
      role: dataDecoded.role, // string: "Admin" | "User"
      accountType: dataDecoded.accountType,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      data: null,
      message: "Token không hợp lệ hoặc đã hết hạn",
    });
  }
};

// Kiểm tra đã đăng nhập
export const isLogin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
  }
  next();
};

// Kiểm tra quyền Admin
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
  }
  if (req.user.role !== ROLE.ADMIN) {
    return res.status(403).json({ message: "Bạn không có quyền truy cập" });
  }
  next();
};

export { checkValidJWT };
