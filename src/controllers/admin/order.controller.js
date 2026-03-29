import {
  getOrdersServices,
  getOrderByIdServices,
  confirmOrderServices,
  shipOrderServices,
  completeOrderServices,
  cancelOrderServices,
  approveReturnServices,
  rejectReturnServices,
  completeReturnServices,
} from "../../services/admin/order.services.js";

const handleError = (res, error, statusCode = 400) => {
  return res.status(statusCode).json({ ErrorCode: 1, message: error.message });
};

export const getOrders = async (req, res) => {
  try {
    const result = await getOrdersServices(req.validated.query);
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

export const getOrderById = async (req, res) => {
  try {
    const order = await getOrderByIdServices(req.validated.params.id);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy chi tiết đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    return handleError(res, error, 404);
  }
};

export const confirmOrder = async (req, res) => {
  try {
    const order = await confirmOrderServices(req.validated.params.id);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Xác nhận đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const shipOrder = async (req, res) => {
  try {
    const order = await shipOrderServices(
      req.validated.params.id,
      req.validated.body,
    );
    return res.status(200).json({
      ErrorCode: 0,
      message: "Cập nhật trạng thái vận chuyển thành công",
      data: order,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const completeOrder = async (req, res) => {
  try {
    const order = await completeOrderServices(req.validated.params.id);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Hoàn thành đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await cancelOrderServices(
      req.validated.params.id,
      req.validated.body,
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

export const approveReturn = async (req, res) => {
  try {
    const order = await approveReturnServices(
      req.validated.params.id,
      req.validated.body,
    );
    return res.status(200).json({
      ErrorCode: 0,
      message: "Duyệt yêu cầu hoàn trả thành công",
      data: order,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const rejectReturn = async (req, res) => {
  try {
    const order = await rejectReturnServices(
      req.validated.params.id,
      req.validated.body,
    );
    return res.status(200).json({
      ErrorCode: 0,
      message: "Từ chối yêu cầu hoàn trả thành công",
      data: order,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const completeReturn = async (req, res) => {
  try {
    const order = await completeReturnServices(
      req.validated.params.id,
      req.validated.body, // { refundId, refundNote }
    );
    return res.status(200).json({
      ErrorCode: 0,
      message: "Xác nhận hoàn trả thành công",
      data: order,
    });
  } catch (error) {
    return handleError(res, error);
  }
};
