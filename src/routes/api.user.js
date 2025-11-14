// src/routes/product.routes.js
import { Router } from "express";
import { postCreateUser } from "../controllers/user.controller.js";
const router = Router();

router.post("/users", postCreateUser);

export default router;
