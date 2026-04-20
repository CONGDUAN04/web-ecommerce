import { NotFoundError } from "../../utils/AppError.js";
import { parsePagination } from "../../utils/pagination.js";
import { deleteFileService } from "../upload/upload.services.js";

export const getAll = async (model, { page = 1, limit = 10 }, options = {}) => {
  const { skip, page: p, limit: l } = parsePagination({ page, limit });

  const [items, total] = await Promise.all([
    model.findMany({
      skip,
      take: l,
      ...options,
    }),
    model.count(),
  ]);

  return {
    items,
    pagination: {
      page: p,
      limit: l,
      total,
      totalPages: Math.ceil(total / l),
    },
  };
};

// 🔥 GET BY ID
export const getById = async (
  model,
  id,
  options = {},
  entityName = "dữ liệu",
) => {
  const item = await model.findUnique({
    where: { id: Number(id) },
    ...options,
  });

  if (!item) throw new NotFoundError(`Không tìm thấy ${entityName}`);

  return item;
};

// 🔥 DELETE + CLEANUP FILE
export const deleteWithFile = async (
  model,
  id,
  fileField,
  user,
  entityName = "dữ liệu",
) => {
  id = Number(id);

  const item = await model.findUnique({ where: { id } });

  if (!item) throw new NotFoundError(`Không tìm thấy ${entityName}`);

  const deleted = await model.delete({ where: { id } });

  if (item[fileField]) {
    deleteFileService(item[fileField], user).catch((err) => {
      console.error("Xoá file thất bại:", err.message);
    });
  }

  return deleted;
};
