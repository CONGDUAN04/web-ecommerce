import {
  getPaymentsServices,
  getPaymentByIdServices,
  confirmBankingServices,
} from "../../services/admin/payment.services.js";

const handleError = (res, error, statusCode = 400) =>
  res.status(statusCode).json({ ErrorCode: 1, message: error.message });

export const getPayments = async (req, res) => {
  try {
    const result = await getPaymentsServices(req.validated.query);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy danh sách giao dịch thành công",
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleError(res, error, 500);
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const payment = await getPaymentByIdServices(req.validated.params.id);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy chi tiết giao dịch thành công",
      data: payment,
    });
  } catch (error) {
    return handleError(res, error, 404);
  }
};

export const confirmBanking = async (req, res) => {
  try {
    const payment = await confirmBankingServices(
      req.validated.params.id,
      req.validated.body,
    );
    return res.status(200).json({
      ErrorCode: 0,
      message: "Xác nhận thanh toán thành công",
      data: payment,
    });
  } catch (error) {
    return handleError(res, error);
  }
};
