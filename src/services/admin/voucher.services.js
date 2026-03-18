import prisma from "../../config/client.js";
import { parsePagination } from "../../utils/pagination.js";

// GET /admin/vouchers
export const getVoucherServices = async ({
    page = 1,
    limit = 10,
    search,
    type,
    isActive,
    from,
    to,
}) => {
    const { page: p, limit: l, skip } = parsePagination({ page, limit });

    const where = {
        ...(search && {
            code: { contains: search.toUpperCase() },
        }),
        ...(type && { type }),
        ...(isActive !== undefined && { isActive }),
        ...(from || to
            ? {
                endDate: {
                    ...(from && { gte: new Date(from) }),
                    ...(to && { lte: new Date(to) }),
                },
            }
            : {}),
    };

    const [items, total] = await Promise.all([
        prisma.voucher.findMany({
            where,
            skip,
            take: l,
            orderBy: { id: "desc" },
        }),
        prisma.voucher.count({ where }),
    ]);

    return {
        items,
        meta: {
            total,
            page: p,
            limit: l,
            totalPages: Math.ceil(total / l),
        },
    };
};

// GET /admin/vouchers/:id
export const getVoucherByIdServices = async (id) => {
    const voucher = await prisma.voucher.findUnique({ where: { id } });
    if (!voucher) throw new Error("Voucher không tồn tại");
    return voucher;
};

// POST /admin/vouchers
export const createVoucherServices = async (data) => {
    const existed = await prisma.voucher.findUnique({
        where: { code: data.code },
    });
    if (existed) throw new Error(`Mã voucher "${data.code}" đã tồn tại`);

    return prisma.voucher.create({
        data: {
            ...data,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
        },
    });
};

// PATCH /admin/vouchers/:id
export const updateVoucherServices = async (id, data) => {
    const voucher = await prisma.voucher.findUnique({ where: { id } });
    if (!voucher) throw new Error("Voucher không tồn tại");

    const isExpired = new Date(voucher.endDate) < new Date();

    if (isExpired) {
        // Voucher hết hạn → bắt buộc gửi kèm endDate mới để gia hạn
        if (!data.endDate) {
            throw new Error(
                "Voucher đã hết hạn, vui lòng cung cấp endDate mới để gia hạn trước khi chỉnh sửa"
            );
        }

        if (new Date(data.endDate) < new Date()) {
            throw new Error("endDate gia hạn phải sau thời điểm hiện tại");
        }
    }

    // Validate startDate < endDate dùng giá trị hiện tại nếu không gửi lên
    const finalStartDate = data.startDate ? new Date(data.startDate) : voucher.startDate;
    const finalEndDate = data.endDate ? new Date(data.endDate) : voucher.endDate;

    if (finalStartDate >= finalEndDate) {
        throw new Error("Ngày bắt đầu phải trước ngày kết thúc");
    }

    return prisma.voucher.update({
        where: { id },
        data: {
            ...data,
            ...(data.startDate && { startDate: new Date(data.startDate) }),
            ...(data.endDate && { endDate: new Date(data.endDate) }),
        },
    });
};

// DELETE /admin/vouchers/:id
export const deleteVoucherServices = async (id) => {
    const voucher = await prisma.voucher.findUnique({ where: { id } });
    if (!voucher) throw new Error("Voucher không tồn tại");

    const usageCount = await prisma.voucherUsage.count({
        where: { voucherId: id },
    });

    if (usageCount > 0) {
        throw new Error(`Không thể xoá voucher đã được sử dụng ${usageCount} lần`);
    }

    return prisma.voucher.delete({ where: { id } });
};

// GET /admin/vouchers/:id/usages
export const getVoucherUsageServices = async (id, { page = 1, limit = 20 }) => {
    const voucher = await prisma.voucher.findUnique({ where: { id } });
    if (!voucher) throw new Error("Voucher không tồn tại");
    const { page: p, limit: l, skip } = parsePagination({ page, limit });

    const [items, total] = await Promise.all([
        prisma.voucherUsage.findMany({
            where: { voucherId: id },
            skip,
            take: l,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { id: true, username: true, fullName: true },
                },
                order: {
                    select: {
                        id: true,
                        finalPrice: true,
                        discountAmount: true,
                        status: true,
                        createdAt: true,
                    },
                },
            },
        }),
        prisma.voucherUsage.count({ where: { voucherId: id } }),
    ]);

    return {
        voucher,
        items,
        meta: {
            total,
            page: p,
            limit: l,
            totalPages: Math.ceil(total / l),
        },
    };
};