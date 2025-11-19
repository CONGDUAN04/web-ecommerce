import prisma from "./client.js";
import { ACCOUNT_TYPE } from "./constant.js";

const initDatabase = async () => {
    const countUser = await prisma.user.count();
    const countRole = await prisma.role.count();
    if (countRole === 0) {
        await prisma.role.createMany({
            data: [
                {
                    name: "ADMIN",
                    description: "Admin thì full quyền",
                },
                {
                    name: "USER",
                    description: "User thông thường",
                },
            ],
        });
    }

    if (countUser === 0) {
        const adminRole = await prisma.role.findFirst({
            where: { name: "ADMIN" },
        });
        if (adminRole) {
            await prisma.user.createMany({
                data: [
                    {
                        fullName: "Phạm Công Duẩn",
                        username: "phamcongduannn@gmail.com",
                        password: "123456",
                        accountType: ACCOUNT_TYPE.SYSTEM,
                        roleId: adminRole.id,
                    },
                    {
                        fullName: "Admin",
                        username: "admin@gmail.com",
                        password: "123456",
                        accountType: ACCOUNT_TYPE.SYSTEM,
                        roleId: adminRole.id,
                    },
                ],
            });
        }
    }

    if (countRole !== 0 && countUser !== 0) {
        console.log(">>> ALREADY INIT DATA...");
    }
};

export default initDatabase;
