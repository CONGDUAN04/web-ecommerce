import {
    createBrandServices,
    getBrandsServices,
    getBrandByIdServices,
    updateBrandServices,
    deleteBrandServices,
} from "../../services/admin/brand.services.js";

export const getBrands = async (req, res) => {
    try {
        const brands = await getBrandsServices(req.validated.query);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy danh sách thương hiệu thành công",
            data: brands.items,
            pagination: brands.pagination,
        });
    } catch (error) {
        return res.status(500).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const getBrandById = async (req, res) => {
    try {
        const brand = await getBrandByIdServices(req.validated.params.id);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy thương hiệu thành công",
            data: brand,
        });
    } catch (error) {
        return res.status(404).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const createBrand = async (req, res) => {
    try {
        const image = req.file?.filename;
        const brand = await createBrandServices(req.validated.body, image);

        return res.status(201).json({
            ErrorCode: 0,
            message: "Tạo thương hiệu thành công",
            data: brand,
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const updateBrand = async (req, res) => {
    try {
        const image = req.file?.filename;
        const brand = await updateBrandServices(
            req.validated.params.id,
            req.validated.body,
            image
        );

        return res.status(200).json({
            ErrorCode: 0,
            message: "Cập nhật thương hiệu thành công",
            data: brand,
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const deleteBrand = async (req, res) => {
    try {
        await deleteBrandServices(req.validated.params.id);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Xóa thương hiệu thành công",
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};