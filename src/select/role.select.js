const adminRoleSelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  _count: { select: { users: true } },
};
