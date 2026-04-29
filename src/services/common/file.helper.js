import { deleteFileService } from "../upload/upload.services.js";

export const cleanupOldFile = (oldId, newId, user, label = "file") => {
  console.log("=== CLEANUP CALLED ===");
  console.log("label:", label);
  console.log("oldId:", oldId);
  console.log("newId:", newId);
  console.log("user role:", user?.role);
  if (newId && oldId && newId !== oldId) {
    deleteFileService(oldId, user).catch((err) => {
      console.error(`Xoá ${label} cũ thất bại:`, err.message);
    });
  }
};
