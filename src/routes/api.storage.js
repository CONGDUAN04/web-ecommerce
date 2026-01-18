import express from "express";
import {
    createStorage,
    getStorages,
    updateStorage,
    deleteStorage,
    getStorageById
} from "../controllers/admin/storage.controller.js";
import { idParamSchema } from "../validations/common/params.js";
import { validate } from "../middleware/validate.middleware.js"
import { paginationSchema } from "../validations/common/query.js";
import { createStorageSchema } from "../validations/storage/create.storage.js";
import { updateStorageSchema } from "../validations/storage/update.storage.js";
const router = express.Router();

router.get("/", validate(paginationSchema), getStorages);
router.get("/:id", validate(idParamSchema), getStorageById)
router.post("/", validate(createStorageSchema), createStorage);
router.put("/:id", validate(updateStorageSchema), updateStorage);
router.delete("/:id", validate(idParamSchema), deleteStorage);

export default router;
