import prisma from "../../config/client.js";

export const getDashboardInfo = async () => {
    const countUser = await prisma.user.count();
    const countProduct = await prisma.product.count();
    return {
        countUser,
        countProduct,
    };
}