import {
  getInventoryLogsServices,
  getInventoryLogByIdServices,
  getInventorySummaryServices,
  createInventoryLogServices,
} from "../../services/admin/inventory.services.js";

export const getInventoryLogs = async (req, res) => {
  try {
    const result = await getInventoryLogsServices(req.validated.query);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy danh sách phiếu kho thành công",
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(500).json({ ErrorCode: 1, message: error.message });
  }
};

export const getInventorySummary = async (req, res) => {
  try {
    const result = await getInventorySummaryServices(req.validated.query);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy tổng quan tồn kho thành công",
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(500).json({ ErrorCode: 1, message: error.message });
  }
};

export const getInventoryLogById = async (req, res) => {
  try {
    const log = await getInventoryLogByIdServices(req.validated.params.id);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy phiếu kho thành công",
      data: log,
    });
  } catch (error) {
    return res.status(404).json({ ErrorCode: 1, message: error.message });
  }
};

export const createInventoryLog = async (req, res) => {
  try {
    const log = await createInventoryLogServices(req.validated.body);
    return res.status(201).json({
      ErrorCode: 0,
      message: "Tạo phiếu kho thành công",
      data: log,
    });
  } catch (error) {
    return res.status(400).json({ ErrorCode: 1, message: error.message });
  }
};
