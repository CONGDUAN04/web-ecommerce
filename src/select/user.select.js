export const adminUserSelect = {
  id: true,
  username: true,
  fullName: true,
  phone: true,
  avatar: true,
  accountType: true,
  createdAt: true,
  role: { select: { id: true, name: true } },
};
