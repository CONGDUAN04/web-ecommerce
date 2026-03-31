import {
  createOrderService,
  getOrdersService,
  getOrderByIdService,
  cancelOrderService,
} from "../../services/client/order.services.js";

const handleError = (res, error, statusCode = 400) => {
  return res.status(statusCode).json({ ErrorCode: 1, message: error.message });
};

// POST /api/v1/orders
export const createOrder = async (req, res) => {
  try {
    const order = await createOrderService(req.user.id, req.validated.body);
    return res.status(201).json({
      ErrorCode: 0,
      message: "Đặt hàng thành công",
      data: order,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// GET /api/v1/orders
export const getOrders = async (req, res) => {
  try {
    const result = await getOrdersService(req.user.id, req.validated.query);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy danh sách đơn hàng thành công",
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleError(res, error, 500);
  }
};

// GET /api/v1/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await getOrderByIdService(
      req.user.id,
      req.validated.params.id,
    );
    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy chi tiết đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    return handleError(res, error, 404);
  }
};

// PATCH /api/v1/orders/:id/cancel
export const cancelOrder = async (req, res) => {
  try {
    const order = await cancelOrderService(
      req.user.id,
      req.validated.params.id,
      req.validated.body.cancelReason,
    );
    return res.status(200).json({
      ErrorCode: 0,
      message: "Huỷ đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    return handleError(res, error);
  }
};
