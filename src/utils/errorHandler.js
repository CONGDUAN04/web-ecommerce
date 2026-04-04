import { AppError } from "../utils/AppError.js";

export const errorHandler = (err, req, res, next) => {
  // Lỗi business — có statusCode rõ ràng
  if (err instanceof AppError) {
    const body = {
      error: {
        code: err.code,
        message: err.message,
        ...(err.errors && { errors: err.errors }),
      },
    };
    return res.status(err.statusCode).json(body);
  }

  // Lỗi Prisma
  if (err.code === "P2002") {
    return res.status(409).json({
      error: { code: "DUPLICATE_ENTRY", message: "Dữ liệu đã tồn tại" },
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      error: { code: "NOT_FOUND", message: "Không tìm thấy dữ liệu" },
    });
  }

  // Lỗi JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: { code: "INVALID_TOKEN", message: "Token không hợp lệ" },
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: { code: "TOKEN_EXPIRED", message: "Token đã hết hạn" },
    });
  }

  // Lỗi không xác định — log ra server, không expose ra client
  console.error("[ERROR]", err);
  return res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Lỗi hệ thống, vui lòng thử lại sau",
    },
  });
};
