import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.body?.username || ipKeyGenerator(req),
  message: {
    success: false,
    message: "Quá nhiều lần đăng nhập, thử lại sau 5 phút",
  },
});

export const registerLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => req.body?.username || ipKeyGenerator(req),
  message: {
    success: false,
    message: "Quá nhiều lần đăng ký, vui lòng thử lại sau",
  },
});

export const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.body?.username || ipKeyGenerator(req),
  message: {
    success: false,
    message: "Bạn thao tác quá nhanh, vui lòng đợi",
  },
});
