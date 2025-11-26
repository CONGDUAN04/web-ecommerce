import {
    putUpdateProductsServices,
    getProductByIdServices,
    createProductService,
    getAllProductsService,

} from "../../services/admin/product.services.js";
export const postCreateProductController = async (req, res) => {
    try {
        const product = await createProductService(req.body, req.files);

        return res.status(201).json({
            success: true,
            message: "Tạo sản phẩm thành công",
            data: product,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Tạo sản phẩm thất bại",
            error: err.message,
        });
    }
};

export const getAllProductsController = async (req, res) => {
    try {
        const products = await getAllProductsService();

        return res.status(200).json({
            success: true,
            message: "Lấy danh sách sản phẩm thành công!",
            data: products
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lấy danh sách sản phẩm thất bại.",
            error: error.message
        });
    }
};
export const getProductByIdController = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await getProductByIdServices(id);

        return res.status(200).json({
            success: true,
            message: "Lấy sản phẩm thành công",
            data: product
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
            error: null
        });
    }
};
export const putUpdateProduct = async (req, res) => {
    try {
        const data = {
            id: req.params.id,
            ...req.body
        };
        const file = req.file;
        const image = file?.filename;
        const product = await putUpdateProductsServices(data, image);
        return res.status(200).json({
            success: true,
            message: "Cập nhật sản phẩm thành công!",
            data: product
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
            error: null
        });
    }
};

export const deleteProduct = async (req, res) => {
    const id = +req.params.id;
    try {
        await prisma.$transaction(async (tx) => {
            await tx.cartDetail.deleteMany({ where: { productId: id } });
            await tx.cartDetailVariant.deleteMany({
                where: { variant: { productId: id } }
            });
            await tx.wishlist.deleteMany({ where: { productId: id } });
            await tx.review.deleteMany({ where: { productId: id } });
            await tx.productVariant.deleteMany({ where: { productId: id } });
            await tx.product.delete({ where: { id } });
        });
        return res.status(200).json({
            success: true,
            message: "Xoá sản phẩm và các dữ liệu liên quan thành công",
            data: null
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
            error: null
        });
    }
};

