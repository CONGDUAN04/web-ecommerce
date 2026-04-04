export class AppError extends Error {
  constructor(message, statusCode = 400, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true; // phân biệt lỗi business vs lỗi hệ thống
  }
}

// Subclasses tiện dụng
export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} không tồn tại`, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message, code = "CONFLICT") {
    super(message, 409, code);
  }
}

export class ValidationError extends AppError {
  constructor(message, code = "VALIDATION_ERROR") {
    super(message, 422, code);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Bạn không có quyền thực hiện hành động này") {
    super(message, 403, "FORBIDDEN");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Bạn chưa đăng nhập") {
    super(message, 401, "UNAUTHORIZED");
  }
}
