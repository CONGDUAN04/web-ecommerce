import prisma from "../../config/client.js";
import { parsePagination } from "../../utils/pagination.js";

const variantInclude = {
    product: {
        select: {
            id: true,
            name: true,
            slug: true,
            groupId: true,
            brandId: true,
            categoryId: true,
            group: {
                select: { id: true, name: true, series: true }
            }
        }
    }
};

// ========================
// GET LIST
// ========================

export const getVariantsServices = async ({
    page = 1,
    limit = 10,
    productId,
    storage,
    color
}) => {
    const { page: p, limit: l, skip } = parsePagination({ page, limit });

    const where = { isActive: true };
    if (productId) where.productId = Number(productId);
    if (storage) where.storage = Number(storage);
    if (color) where.color = { contains: color };

    const [items, total] = await Promise.all([
        prisma.variant.findMany({
            where,
            skip,
            take: l,
            orderBy: [{ productId: "asc" }, { storage: "asc" }, { color: "asc" }],
            include: variantInclude
        }),
        prisma.variant.count({ where })
    ]);

    return {
        items,
        pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) }
    };
};

// ========================
// GET BY ID
// ========================

export const getVariantByIdServices = async (id) => {
    const variant = await prisma.variant.findUnique({
        where: { id: Number(id) },
        include: variantInclude
    });

    if (!variant) throw new Error("Variant không tồn tại");
    return variant;
};

// ========================
// GET BY PRODUCT ID
// Trả về variants + storages[] + colors[]
// để frontend render 2 selector (như CellphoneS)
// ========================

export const getVariantsByProductIdServices = async (productId) => {
    const product = await prisma.product.findUnique({
        where: { id: Number(productId) }
    });
    if (!product) throw new Error("Sản phẩm không tồn tại");

    const variants = await prisma.variant.findMany({
        where: { productId: Number(productId), isActive: true },
        orderBy: [{ storage: "asc" }, { color: "asc" }]
    });

    // Nhóm riêng để frontend render selector
    const storages = [...new Set(variants.map(v => v.storage))].sort((a, b) => a - b);
    const colors = [...new Set(variants.map(v => v.color))];

    return { variants, storages, colors };
};

// ========================
// CREATE
// ========================

export const createVariantServices = async (data) => {
    // Kiểm tra product tồn tại và bắt buộc thuộc group
    const product = await prisma.product.findUnique({
        where: { id: Number(data.productId) }
    });
    if (!product) throw new Error("Sản phẩm không tồn tại");
    if (!product.isActive) throw new Error("Sản phẩm đã bị ẩn");

    // SKU phải unique toàn hệ thống
    const skuExist = await prisma.variant.findUnique({
        where: { sku: data.sku }
    });
    if (skuExist) throw new Error("SKU đã tồn tại");

    // Không cho trùng color + storage trong cùng 1 product
    const duplicate = await prisma.variant.findFirst({
        where: {
            productId: Number(data.productId),
            color: data.color,
            storage: data.storage
        }
    });
    if (duplicate) {
        throw new Error(
            `Variant ${data.color} - ${data.storage}GB đã tồn tại trong sản phẩm này`
        );
    }

    return prisma.variant.create({
        data: {
            productId: Number(data.productId),
            sku: data.sku,
            color: data.color,
            storage: data.storage,
            price: data.price,
            comparePrice: data.comparePrice ?? null,
            quantity: data.quantity ?? 0
        },
        include: variantInclude
    });
};

// ========================
// UPDATE
// ========================

export const updateVariantServices = async (id, data) => {
    id = Number(id);

    const exist = await prisma.variant.findUnique({ where: { id } });
    if (!exist) throw new Error("Variant không tồn tại");

    const updateData = {};

    // Kiểm tra SKU trùng
    if (data.sku !== undefined) {
        const skuExist = await prisma.variant.findFirst({
            where: { sku: data.sku, NOT: { id } }
        });
        if (skuExist) throw new Error("SKU đã tồn tại");
        updateData.sku = data.sku;
    }

    // Kiểm tra trùng color + storage trong cùng product
    const newColor = data.color ?? exist.color;
    const newStorage = data.storage ?? exist.storage;

    if (data.color !== undefined || data.storage !== undefined) {
        const duplicate = await prisma.variant.findFirst({
            where: {
                productId: exist.productId,
                color: newColor,
                storage: newStorage,
                NOT: { id }
            }
        });
        if (duplicate) {
            throw new Error(
                `Variant ${newColor} - ${newStorage}GB đã tồn tại trong sản phẩm này`
            );
        }
        if (data.color !== undefined) updateData.color = data.color;
        if (data.storage !== undefined) updateData.storage = data.storage;
    }

    // Validate comparePrice >= price
    const newPrice = data.price ?? exist.price;
    const newComparePrice = data.comparePrice ?? exist.comparePrice;

    if (newComparePrice && newComparePrice < newPrice) {
        throw new Error("Giá gốc phải lớn hơn hoặc bằng giá bán");
    }

    if (data.price !== undefined) updateData.price = data.price;
    if (data.comparePrice !== undefined) updateData.comparePrice = data.comparePrice;
    if (data.quantity !== undefined) updateData.quantity = data.quantity;
    if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);

    return prisma.variant.update({
        where: { id },
        data: updateData,
        include: variantInclude
    });
};

// ========================
// DELETE (soft delete)
// ========================

export const deleteVariantServices = async (id) => {
    id = Number(id);

    const exist = await prisma.variant.findUnique({ where: { id } });
    if (!exist) throw new Error("Variant không tồn tại");

    await prisma.variant.update({
        where: { id },
        data: { isActive: false }
    });

    return true;
};