import { comparePassword, hashPassword } from "../../utils/hashPassword.js";
import prisma from "../../config/client.js";
import { ACCOUNT_TYPE } from "../../constants/index.js";
import jwt from "jsonwebtoken";
import {
  createSession,
  findSessionByToken,
  validateSession,
  revokeSession,
} from "../admin/session.js";
import {
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ValidationError,
} from "../../utils/AppError.js";
import {
  sendVerifyOtpEmail,
  sendResetPasswordOtpEmail,
} from "../email/email.services.js";
import crypto from "crypto";
import { OtpType } from "@prisma/client";

export const isEmailExist = async (email) => {
  const count = await prisma.user.count({ where: { username: email } });
  return count > 0;
};
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
export const registerNewUser = async (data) => {
  const { fullName, username, password } = data;

  const role = await prisma.role.findUnique({
    where: { name: "User" },
  });

  if (!role) throw new NotFoundError("Role User không tồn tại");

  const existed = await prisma.user.findUnique({
    where: { username },
  });

  if (existed?.isVerified) {
    throw new ConflictError("Email đã được sử dụng");
  }

  const otp = generateOtp();
  const hashedPassword = await hashPassword(password);

  const otpData = {
    otp,
    otpType: OtpType.VERIFY_EMAIL,
    otpExpire: new Date(Date.now() + 5 * 60 * 1000),
    otpSentAt: new Date(),
    otpAttempt: 0,
  };

  if (existed && !existed.isVerified) {
    await prisma.user.update({
      where: { id: existed.id },
      data: {
        fullName,
        password: hashedPassword,
        ...otpData,
      },
    });

    await sendVerifyOtpEmail(username, otp);

    return {
      message: "Email đã tồn tại nhưng chưa xác thực, OTP đã được gửi lại",
    };
  }

  await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      fullName,
      roleId: role.id,
      accountType: ACCOUNT_TYPE.SYSTEM,

      isActive: false,
      isVerified: false,

      ...otpData,
    },
  });

  await sendVerifyOtpEmail(username, otp);

  return {
    message: "Đăng ký thành công, vui lòng kiểm tra email để xác thực",
  };
};

export const handleLogin = async (username, password, meta = {}) => {
  const user = await prisma.user.findUnique({
    where: { username },
    include: { role: true },
  });

  if (!user) {
    throw new UnauthorizedError("Email hoặc mật khẩu không đúng");
  }

  if (!user.isVerified) {
    throw new UnauthorizedError("Bạn chưa xác thực email");
  }

  if (!user.isActive) {
    throw new UnauthorizedError("Tài khoản đã bị vô hiệu hóa");
  }

  if (user.accountType !== ACCOUNT_TYPE.SYSTEM) {
    throw new UnauthorizedError(
      `Tài khoản này được liên kết qua ${user.accountType}, vui lòng đăng nhập bằng phương thức đó`,
    );
  }

  if (!user.password)
    throw new UnauthorizedError("Email hoặc mật khẩu không đúng");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new UnauthorizedError("Email hoặc mật khẩu không đúng");

  const payload = {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    role: user.role?.name,
    accountType: user.accountType,
  };

  const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const session = await createSession({
    userId: user.id,
    userAgent: meta.userAgent,
    ipAddress: meta.ipAddress,
  });

  return { access_token, refresh_token: session.refreshToken };
};

export const handleRefreshToken = async (token) => {
  if (!token) throw new UnauthorizedError("Không tìm thấy refresh token");

  const session = await findSessionByToken(token);
  validateSession(session);

  const { user } = session;

  const payload = {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    role: user.role?.name,
    accountType: user.accountType,
  };

  const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return { access_token };
};

export const handleLogout = async (refreshToken) => {
  if (!refreshToken) return;
  await revokeSession(refreshToken);
};

export const resendOtpService = async (username) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) throw new NotFoundError("Tài khoản không tồn tại");

  if (
    user.otpSentAt &&
    Date.now() - new Date(user.otpSentAt).getTime() < 30000
  ) {
    throw new ValidationError("Vui lòng đợi 30 giây trước khi gửi lại OTP");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpData = {
    otp,
    otpType: user.otpType,
    otpExpire: new Date(Date.now() + 5 * 60 * 1000),
    otpSentAt: new Date(),
    otpAttempt: 0,
  };

  await prisma.user.update({
    where: { id: user.id },
    data: otpData,
  });

  await sendVerifyOtpEmail(username, otp);
};

export const verifyOtpService = async (username, otp) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new NotFoundError("Tài khoản không tồn tại");
  }

  if (!user.otp || !user.otpType) {
    throw new ValidationError("OTP không hợp lệ hoặc đã được sử dụng");
  }

  if (user.otpExpire && user.otpExpire < new Date()) {
    throw new ValidationError("OTP đã hết hạn, vui lòng gửi lại OTP");
  }

  if ((user.otpAttempt || 0) >= 5) {
    throw new ValidationError("OTP đã bị khóa, vui lòng gửi lại OTP mới");
  }

  if (user.otp !== otp) {
    const newAttempt = (user.otpAttempt || 0) + 1;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpAttempt: newAttempt,
      },
    });

    throw new ValidationError("OTP không chính xác");
  }

  const isVerifyEmail = user.otpType === OtpType.VERIFY_EMAIL;

  const clearOtpData = {
    otp: null,
    otpType: null,
    otpExpire: null,
    otpSentAt: null,
    otpAttempt: 0,
  };

  await prisma.user.update({
    where: { id: user.id },
    data: {
      ...clearOtpData,
      ...(isVerifyEmail && {
        isVerified: true,
        isActive: true,
      }),
    },
  });

  return {
    message: isVerifyEmail
      ? "Xác thực email thành công"
      : "Xác thực OTP thành công, bạn có thể đặt lại mật khẩu",
  };
};

export const forgotPasswordService = async (username) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new NotFoundError("Tài khoản không tồn tại");
  }

  if (!user.isVerified) {
    throw new ValidationError("Tài khoản chưa được xác thực email");
  }

  if (
    user.otpSentAt &&
    Date.now() - new Date(user.otpSentAt).getTime() < 30000
  ) {
    throw new ValidationError("Vui lòng đợi 30 giây trước khi gửi lại OTP");
  }

  const otp = generateOtp();

  const otpData = {
    otp,
    otpType: OtpType.RESET_PASSWORD,
    otpExpire: new Date(Date.now() + 5 * 60 * 1000),
    otpSentAt: new Date(),
    otpAttempt: 0,
  };

  await prisma.user.update({
    where: { id: user.id },
    data: otpData,
  });

  await sendResetPasswordOtpEmail(username, otp);

  return {
    message: "Đã gửi OTP đặt lại mật khẩu",
  };
};

export const resetPasswordService = async (username, newPassword) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new NotFoundError("Tài khoản không tồn tại");
  }

  if (!newPassword) {
    throw new ValidationError("Mật khẩu mới không được để trống");
  }

  if (newPassword.length < 6) {
    throw new ValidationError("Mật khẩu phải có ít nhất 6 ký tự");
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
    },
  });

  return { message: "Đổi mật khẩu thành công" };
};
