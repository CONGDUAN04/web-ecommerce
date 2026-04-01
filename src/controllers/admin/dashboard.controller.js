import {
  getDashboardOverviewServices,
  getRevenueSummaryServices,
  getOrderStatusServices,
  getTopProductsServices,
  getLowStockServices,
  getRecentOrdersServices,
} from "../../services/admin/dashboard.services.js";

export const getDashboardOverview = async (req, res) => {
  try {
    const data = await getDashboardOverviewServices();

    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy tổng quan dashboard thành công",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      ErrorCode: 1,
      message: error.message,
    });
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
    return res.status(500).json({
      ErrorCode: 1,
      message: error.message,
    });
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
    return res.status(500).json({
      ErrorCode: 1,
      message: error.message,
    });
  }
};

export const getTopProducts = async (req, res) => {
  try {
    const { limit } = req.query;

    const data = await getTopProductsServices(limit);

    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy top sản phẩm bán chạy thành công",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      ErrorCode: 1,
      message: error.message,
    });
  }
};

export const getLowStock = async (req, res) => {
  try {
    const { threshold } = req.query;

    const data = await getLowStockServices(threshold);

    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy danh sách tồn kho thấp thành công",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      ErrorCode: 1,
      message: error.message,
    });
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    const { limit } = req.query;

    const data = await getRecentOrdersServices(limit);

    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy đơn hàng gần nhất thành công",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      ErrorCode: 1,
      message: error.message,
    });
  }
};
