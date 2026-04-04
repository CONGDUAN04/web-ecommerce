import { Router } from "express";
import {
  getNotificationsQuerySchema,
  markNotificationReadSchema,
  deleteNotificationSchema,
} from "../../validations/client/notification.validation.js";
import {
  getNotifications,
  markAsRead,
  deleteNotification,
} from "../../controllers/client/notification.controller.js";
import { validate } from "../../middleware/validate.middleware.js";

const router = Router();

router.get("/", validate(getNotificationsQuerySchema), getNotifications);
router.patch("/:id/read", validate(markNotificationReadSchema), markAsRead);
router.delete("/:id", validate(deleteNotificationSchema), deleteNotification);

export default router;
