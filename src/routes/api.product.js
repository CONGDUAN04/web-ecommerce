import { Router } from "express";
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controllers/admin/product.controller.js";
import { uploadSingleFile } from "../middleware/multer.js";
import { cleanupFile } from "../middleware/cleanupFile.js";
import { validate } from "../middleware/validate.middleware.js";
import { createProductSchema } from "../validations/product/create.product.js";
import { updateProductSchema } from "../validations/product/update.product.js";
import { paginationSchema } from "../validations/common/query.js";
import { idParamSchema } from "../validations/common/params.js";
const router = Router();
router.post(
    "/",
    uploadSingleFile("thumbnail", "images/product"),
    validate(createProductSchema),
    cleanupFile,
    createProduct
);

router.get("/", validate(paginationSchema), getProducts);
router.get("/:id", validate(idParamSchema), getProductById);
router.put(
    "/:id",
    uploadSingleFile("thumbnail", "images/product"),
    validate(updateProductSchema),
    cleanupFile,
    updateProduct
);
router.delete("/:id", validate(idParamSchema), deleteProduct);

export default router;