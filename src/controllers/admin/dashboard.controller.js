import {
  getDashboardOverviewServices,
  getRevenueSummaryServices,
  getOrderStatusServices,
  getTopProductsServices,
  getLowStockServices,
  getRecentOrdersServices,
} from "../../services/admin/dashboard.services.js";

const handleError = (res, error) =>
  res.status(500).json({ ErrorCode: 1, message: error.message });

export const getDashboardOverview = async (req, res) => {
  try {
    const data = await getDashboardOverviewServices();
    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy tổng quan dashboard thành công",
      data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getRevenueSummary = async (req, res) => {
  try {
    const data = await getRevenueSummaryServices();
    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy thống kê doanh thu thành công",
      data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getOrderStatus = async (req, res) => {
  try {
    const data = await getOrderStatusServices();
    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy thống kê trạng thái đơn hàng thành công",
      data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getTopProducts = async (req, res) => {
  try {
    // FIX #7: validate limit trước khi truyền vào service
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

    const data = await getTopProductsServices(limit);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy top sản phẩm bán chạy thành công",
      data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getLowStock = async (req, res) => {
  try {
    // FIX #7: validate threshold trước khi truyền vào service
    const threshold = Math.min(
      Math.max(parseInt(req.query.threshold) || 5, 0),
      100,
    );

    const data = await getLowStockServices(threshold);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy danh sách tồn kho thấp thành công",
      data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    // FIX #7: validate limit trước khi truyền vào service
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 5, 1), 20);

    const data = await getRecentOrdersServices(limit);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy đơn hàng gần nhất thành công",
      data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};
