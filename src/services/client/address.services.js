import prisma from "../../config/client.js";
import { NotFoundError } from "../../utils/AppError.js";

export const getAddressesService = async (userId) => {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { id: "desc" }],
  });
};

export const createAddressService = async (userId, body) => {
  const { fullName, phone, address, province, district, ward, isDefault } =
    body;

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  const count = await prisma.address.count({ where: { userId } });

  return prisma.address.create({
    data: {
      userId,
      fullName,
      phone,
      address,
      province,
      district,
      ward,
      isDefault: count === 0 ? true : (isDefault ?? false),
    },
  });
};

export const updateAddressService = async (userId, addressId, body) => {
  const existing = await prisma.address.findFirst({
    where: { id: parseInt(addressId), userId },
  });
  if (!existing) throw new NotFoundError("Địa chỉ");

  if (body.isDefault === true) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  return prisma.address.update({
    where: { id: existing.id },
    data: body,
  });
};

export const deleteAddressService = async (userId, addressId) => {
  const existing = await prisma.address.findFirst({
    where: { id: parseInt(addressId), userId },
  });
  if (!existing) throw new NotFoundError("Địa chỉ");

  await prisma.address.delete({ where: { id: existing.id } });

  if (existing.isDefault) {
    const next = await prisma.address.findFirst({
      where: { userId },
      orderBy: { id: "desc" },
    });
    if (next) {
      await prisma.address.update({
        where: { id: next.id },
        data: { isDefault: true },
      });
    }
  }
};
