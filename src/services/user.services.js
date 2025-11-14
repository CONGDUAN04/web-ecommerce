import prisma from '../config/client.js';
export const postCreateUserServices = async (name, email, address) => {
    const user = await prisma.user.create({
        data: {
            name,
            email,
            address
        }
    });
    return user;
}
