import { deleteFileService } from "../upload/upload.services.js";

export const cleanupOldFile = (oldId, newId, user, label = "file") => {
  if (newId && oldId && newId !== oldId) {
    deleteFileService(oldId, user).catch((err) => {
      console.error(`Xoá ${label} cũ thất bại:`, err.message);
    });
  }
};
