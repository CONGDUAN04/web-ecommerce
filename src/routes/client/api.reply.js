import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { deleteReply } from "../../controllers/client/review.controller.js";
import { deleteReplySchema } from "../../validations/client/review.validation.js";

const router = Router();

router.delete("/:replyId", validate(deleteReplySchema), deleteReply);

export default router;
