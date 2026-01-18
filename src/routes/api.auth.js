// routes/auth.routes.js
import { Router } from "express";
import {
    register,
    login,
    logout,
    fetchAccount,
    updateMyProfile,
    changePassword,
} from "../controllers/auth.controller.js";
import { checkValidJWT } from "../middleware/jwt.js";
import { uploadSingleFile } from "../middleware/multer.js";
import { validate } from "../middleware/validate.middleware.js";
import { changePasswordSchema, loginSchema, registerSchema, updateProfileSchema } from "../validations/auth/auth.validation.js";


const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);

router.get("/account", checkValidJWT, fetchAccount);

router.patch(
    "/update-profile",
    checkValidJWT,
    uploadSingleFile("avatar", "avatars"),
    validate(updateProfileSchema),
    updateMyProfile
);

router.put(
    "/change-password",
    checkValidJWT,
    validate(changePasswordSchema),
    changePassword
);

export default router;