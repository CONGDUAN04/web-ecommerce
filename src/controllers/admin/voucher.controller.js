import {
    getVoucherServices,
    getVoucherByIdServices,
    createVoucherServices,
    updateVoucherServices,
    deleteVoucherServices,
    getVoucherUsageServices,
} from "../../services/admin/voucher.services.js";

// GET /admin/vouchers
export const getVouchers = async (req, res) => {
    try {
        const { page, limit, search, type, isActive, from, to } = req.query;

        const data = await getVoucherServices({
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            search,
            type,
            isActive: isActive === undefined ? undefined : isActive === "true",
            from,
            to,
        });

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy danh sách voucher thành công",
            data,
        });
    } catch (error) {
        return res.status(400).json({ ErrorCode: 1, message: error.message });
    }
};

// GET /admin/vouchers/:id
export const getVoucherById = async (req, res) => {
    try {
        const data = await getVoucherByIdServices(parseInt(req.params.id));

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy thông tin voucher thành công",
            data,
        });
    } catch (error) {
        return res.status(404).json({ ErrorCode: 1, message: error.message });
    }
};

// POST /admin/vouchers
export const createVoucher = async (req, res) => {
    try {
        const data = await createVoucherServices(req.body);

        return res.status(201).json({
            ErrorCode: 0,
            message: "Tạo voucher thành công",
            data,
        });
    } catch (error) {
        return res.status(400).json({ ErrorCode: 1, message: error.message });
    }
};

// PATCH /admin/vouchers/:id
export const updateVoucher = async (req, res) => {
    try {
        const data = await updateVoucherServices(parseInt(req.params.id), req.body);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Cập nhật voucher thành công",
            data,
        });
    } catch (error) {
        return res.status(400).json({ ErrorCode: 1, message: error.message });
    }
};

// DELETE /admin/vouchers/:id
export const deleteVoucher = async (req, res) => {
    try {
        await deleteVoucherServices(parseInt(req.params.id));

        return res.status(200).json({
            ErrorCode: 0,
            message: "Xoá voucher thành công",
        });
    } catch (error) {
        return res.status(400).json({ ErrorCode: 1, message: error.message });
    }
};

// GET /admin/vouchers/:id/usages
export const getVoucherUsages = async (req, res) => {
    try {
        const { page, limit } = req.query;

        const data = await getVoucherUsageServices(parseInt(req.params.id), {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
        });

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy lịch sử dùng voucher thành công",
            data,
        });
    } catch (error) {
        return res.status(404).json({ ErrorCode: 1, message: error.message });
    }
};