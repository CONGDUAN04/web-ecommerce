import { sendEmail } from "../../utils/mailer.js";
import { otpTemplate } from "../../utils/otpTemplate.js";

export const sendVerifyOtpEmail = async (email, otp) => {
  return sendEmail({
    to: email,
    subject: "Xác thực tài khoản OTP",
    html: otpTemplate(otp),
  });
};

export const sendResetPasswordOtpEmail = async (email, otp) => {
  return sendEmail({
    to: email,
    subject: "Khôi phục mật khẩu",
    html: otpTemplate(otp),
  });
};
