import { Router } from "express";

import homePageRoutes from "./api.product.js"

const router = Router();

router.use("/", homePageRoutes)

export default router;
