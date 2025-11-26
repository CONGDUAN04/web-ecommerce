import {
    createBrandServices,
    deleteBrandServices,
    getAllBrandsServices,
    getBrandByIdServices,
    updateBrandServices
} from "../../services/admin/brand.services.js";

export const createBrand = async (req, res) => {
    try {
        const imageBrand = req?.file?.filename ?? undefined;

        const data = {
            ...req.body,
            imageBrand
        };

        const brand = await createBrandServices(data);

        return res.status(201).json({
            ErrorCode: 0,
            message: "Tạo thương hiệu thành công",
            data: brand
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const getBrands = async (req, res) => {
    try {
        const brands = await getAllBrandsServices();

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy danh sách thương hiệu thành công",
            data: brands
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const getBrandById = async (req, res) => {
    try {
        const { id } = req.params;
        const brand = await getBrandByIdServices(id);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy thương hiệu thành công",
            data: brand
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const file = req.file;
        const imageBrand = file?.filename ?? undefined;

        const brand = await updateBrandServices(id, data, imageBrand);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Cập nhật thương hiệu thành công",
            data: brand
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;

        await deleteBrandServices(id);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Xóa thương hiệu thành công"
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};
