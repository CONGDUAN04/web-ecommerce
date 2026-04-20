import {
  generateUploadSignature,
  deleteFileService,
} from "../../services/upload/upload.services.js";

export const getUploadSignature = async (req, res, next) => {
  try {
    const { type } = req.body;

    const data = generateUploadSignature(type);

    return res.json({
      ...data,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (err) {
    next(err);
  }
};
export const deleteFile = async (req, res, next) => {
  try {
    const { publicId } = req.body;

    const result = await deleteFileService(publicId, req.user);

    return res.json({
      message: "Xoá file thành công",
      result,
    });
  } catch (err) {
    next(err);
  }
};
