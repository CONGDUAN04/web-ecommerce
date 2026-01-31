import { validate } from "uuid";
import {
    importInventoryServices,
    exportInventoryServices,
    adjustInventoryServices,
    getInventoryLogsServices
} from "../../services/admin/inventory.services.js";

export const importInventory = async (req, res) => {
    try {
        await importInventoryServices(req.validated.body);

        res.status(200).json({
            ErrorCode: 0,
            message: "Nhập kho thành công"
        });
    } catch (error) {
        res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const exportInventory = async (req, res) => {
    try {
        await exportInventoryServices(req.validated.body);

        res.status(200).json({
            ErrorCode: 0,
            message: "Xuất kho thành công"
        });
    } catch (error) {
        res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const adjustInventory = async (req, res) => {
    try {
        const data = req.body;
        console.log(data)
        await adjustInventoryServices(data);
        res.status(200).json({
            ErrorCode: 0,
            message: "Điều chỉnh kho thành công"
        });
    } catch (error) {
        res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const getInventoryLogs = async (req, res) => {
    try {
        const logs = await getInventoryLogsServices(req.query);

        res.status(200).json({
            ErrorCode: 0,
            data: logs
        });
    } catch (error) {
        res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};
