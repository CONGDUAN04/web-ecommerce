export const adminUserSelect = {
  id: true,
  username: true,
  fullName: true,
  phone: true,
  avatar: true,
  accountType: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  role: { select: { id: true, name: true } },
};
