// notification.controller.js
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
import { NotFoundError } from "../../utils/AppError.js"; // ← thêm import này
import {
  getNotificationsService,
  markAsReadService,
  deleteNotificationService,
} from "../../services/client/notification.services.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const { page, limit } = req.validated?.query || {};
  const result = await getNotificationsService(req.user.id, { page, limit });
  return ApiResponse.success(res, result, {
    message: "Lấy thông báo thành công",
  });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await markAsReadService(
    req.validated.params.id,
    req.user.id,
  );

  if (!notification) throw new NotFoundError("Thông báo"); // ← thay thế ApiResponse.notFound

  return ApiResponse.updated(res, notification, "Đánh dấu thông báo đã đọc");
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const deleted = await deleteNotificationService(
    req.validated.params.id,
    req.user.id,
  );

  if (!deleted) throw new NotFoundError("Thông báo"); // ← thay thế ApiResponse.notFound

  return ApiResponse.deleted(res, "Xóa thông báo thành công");
});
