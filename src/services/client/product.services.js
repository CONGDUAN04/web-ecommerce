import prisma from "../../config/client.js";

export const getHomeProductsService = async () => {
    const products = await prisma.product.findMany({
        where: {
            isActive: true,
        },
        orderBy: {
            id: "desc",
        },
        distinct: ["productGroupId"], // ⭐ chỉ 1 product / group
        take: 8,
        select: {
            id: true,
            name: true,
            slug: true,
            thumbnail: true,

            productGroup: {
                select: {
                    name: true,
                },
            },

            colors: {
                select: {
                    price: true,
                },
                where: {
                    quantity: { gt: 0 },
                },
            },
        },
    });

    return products.map((p) => {
        const prices = p.colors.map((c) => c.price);

        return {
            id: p.id,
            name: p.name,
            groupName: p.productGroup?.name,
            slug: p.slug,
            thumbnail: p.thumbnail,
            price: prices.length ? Math.min(...prices) : 0,
        };
    });
};

