import express from "express";
import {
    createBrand,
    deleteBrand,
    getBrandById,
    getBrands,
    updateBrand,
} from "../controllers/admin/brand.controller.js";
import { uploadSingleFile } from "../middleware/multer.js";

const router = express.Router();
router.get("/", getBrands);
router.get("/:id", getBrandById);
router.post("/", uploadSingleFile('imageBrand', 'images/brand'), createBrand);
router.put("/:id", uploadSingleFile('imageBrand', 'images/brand'), updateBrand);
router.delete("/:id", deleteBrand);

export default router;
