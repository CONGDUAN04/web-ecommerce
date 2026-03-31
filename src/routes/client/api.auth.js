import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshToken,
  getSessions,
  logoutAll,
} from "../../controllers/client/auth.controller.js";
import { checkValidJWT } from "../../middleware/jwt.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
} from "../../validations/client/auth.validation.js";

const router = Router();

// Public
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

// Protected
router.get("/sessions", checkValidJWT, getSessions);
router.post("/logout-all", checkValidJWT, logoutAll);

export default router;
