import { getHomeProductsService } from "../../services/client/product.services.js";

export const getHomeProducts = async (req, res) => {
    try {
        const products = await getHomeProductsService();

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy sản phẩm trang chủ thành công",
            data: products,
        });
    } catch (error) {
        return res.status(500).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};