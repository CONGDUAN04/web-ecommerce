import jwt from "jsonwebtoken";
import { ROLE } from "../constants/index.js";
import prisma from "../config/client.js";
const checkValidJWT = async (req, res, next) => {
  const path = req.originalUrl.replace(/^\/api/, "");

  const whiteList = ["/login", "/register", "/logout", "/refresh-token"];

  const isWhiteList = whiteList.some((route) => path.startsWith(route));
  if (isWhiteList) return next();

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

    const user = await prisma.user.findUnique({
      where: { id: dataDecoded.id },
      include: { role: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        data: null,
        message: "Tài khoản đã bị vô hiệu hóa hoặc không tồn tại",
      });
    }

    req.user = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role?.name,
      accountType: user.accountType,
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

  const allowedRoles = [ROLE.ADMIN, ROLE.SUPER_ADMIN];

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Bạn không có quyền truy cập" });
  }

  next();
};

export { checkValidJWT };
