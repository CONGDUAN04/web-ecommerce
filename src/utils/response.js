export const ApiResponse = {
  success(res, data = null, options = {}) {
    const { message = null, statusCode = 200, meta = null } = options;

    const body = {};

    if (message) body.message = message;
    if (data !== null) body.data = data;
    if (meta) body.meta = meta;

    return res.status(statusCode).json(body);
  },

  created(res, data, message = "Tạo thành công") {
    return this.success(res, data, { message, statusCode: 201 });
  },

  updated(res, data, message = "Cập nhật thành công") {
    return this.success(res, data, { message, statusCode: 200 });
  },

  deleted(res, message = "Xóa thành công") {
    return this.success(res, null, { message, statusCode: 200 });
  },

  noContent(res) {
    return res.status(204).send();
  },

  error(res, message, statusCode = 400, code = "ERROR") {
    return res.status(statusCode).json({ error: { code, message } });
  },
};
