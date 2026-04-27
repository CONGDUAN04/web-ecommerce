import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshToken,
  getSessions,
  logoutAll,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
} from "../../controllers/client/auth.controller.js";
import { checkValidJWT } from "../../middleware/jwt.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../../validations/client/auth.validation.js";
import {
  loginLimiter,
  registerLimiter,
  otpLimiter,
} from "../../middleware/rateLimit.js";
const router = Router();

// Public
router.post("/login", loginLimiter, login);
router.post("/register", validate(registerSchema), registerLimiter, register);
router.post("/verify-otp", validate(verifyOtpSchema), otpLimiter, verifyOtp);
router.post("/resend-otp", validate(resendOtpSchema), otpLimiter, resendOtp);
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  otpLimiter,
  forgotPassword,
);
router.post("/reset-password", validate(resendOtpSchema), resetPassword);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
// Protected
router.get("/sessions", checkValidJWT, getSessions);
router.post("/logout-all", checkValidJWT, logoutAll);

export default router;
