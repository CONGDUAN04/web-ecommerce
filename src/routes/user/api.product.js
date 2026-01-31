import { Router } from "express";
import { getHomeProducts } from "../../controllers/client/product.controller.js";

const router = Router();

router.get("/", getHomeProducts);

export default router;
