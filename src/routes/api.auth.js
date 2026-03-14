import { Router } from "express";
import {
    register,
    login,
    logout,
    refreshToken,
    fetchAccount,
    updateMyProfile,
    changePassword,
    getSessions,
    logoutAll,
} from "../controllers/auth.controller.js";
import { checkValidJWT } from "../middleware/jwt.js";
import { uploadSingleFile } from "../middleware/multer.js";
import { validate } from "../middleware/validate.middleware.js";
import {
    registerSchema,
    loginSchema,
    changePasswordSchema,
    updateProfileSchema,
} from "../validations/auth/auth.validation.js";

const router = Router();

// Public routes
router.post("/auth/register", validate(registerSchema), register);
router.post("/auth/login", validate(loginSchema), login);
router.post("/auth/logout", logout);
router.post("/auth/refresh-token", refreshToken);

// Protected routes (yêu cầu đăng nhập)
router.get("/auth/me", checkValidJWT, fetchAccount);

router.patch(
    "/auth/update-profile",
    checkValidJWT,
    uploadSingleFile("avatar", "avatars"),
    validate(updateProfileSchema),
    updateMyProfile
);

router.patch(
    "/auth/change-password",
    checkValidJWT,
    validate(changePasswordSchema),
    changePassword
);

router.get("/auth/sessions", checkValidJWT, getSessions);
router.post("/auth/logout-all", checkValidJWT, logoutAll);

export default router;