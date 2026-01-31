import prisma from "../../config/client.js";

export const getHomeProductsService = async () => {
    const products = await prisma.product.findMany({
        where: {
            isActive: true,
            deletedAt: null,
        },
        take: 8,
        orderBy: { id: "desc" },
        select: {
            id: true,
            name: true,
            slug: true,
            thumbnail: true,
            colors: {
                select: {
                    storages: {
                        where: { quantity: { gt: 0 } },
                        select: { price: true },
                    },
                },
            },
        },
    });

    return products.map((product) => {
        const prices = product.colors.flatMap((color) =>
            color.storages.map((storage) => storage.price)
        );

        return {
            id: product.id,
            name: product.name,
            slug: product.slug,
            thumbnail: product.thumbnail,
            price: prices.length ? Math.min(...prices) : 0,
        };
    });
};