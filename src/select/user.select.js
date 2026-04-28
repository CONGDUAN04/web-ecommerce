export const adminUserSelect = {
  id: true,
  username: true,
  fullName: true,
  phone: true,
  avatar: true,
  avatarId: true,
  accountType: true,
  isActive: true,
  isVerified: true,

  // 🔥 THÊM MẤY FIELD NÀY
  otp: true,
  otpType: true,
  otpExpire: true,
  otpSentAt: true,
  otpAttempt: true,

  lastLoginAt: true,
  passwordChangedAt: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,

  role: {
    select: {
      id: true,
      name: true,
    },
  },
};
