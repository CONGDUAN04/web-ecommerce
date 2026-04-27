export const otpTemplate = (otp) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f6f8fb; padding:40px 0;">
    <div style="max-width:480px; margin:auto; background:#ffffff; padding:24px; border-radius:10px; box-shadow:0 2px 10px rgba(0,0,0,0.05);">
      
      <h2 style="text-align:center; color:#333;">Xác thực tài khoản</h2>

      <p style="text-align:center; color:#666;">
        Đây là mã OTP của bạn:
      </p>

      <div style="text-align:center; margin:25px 0;">
        <div style="
          font-size:30px;
          font-weight:bold;
          letter-spacing:8px;
          color:#2d5bff;
          background:#f0f4ff;
          display:inline-block;
          padding:10px 20px;
          border-radius:8px;
        ">
          ${otp}
        </div>
      </div>

      <p style="text-align:center; font-size:12px; color:#888;">
        OTP có hiệu lực trong <b>5 phút</b>. Không chia sẻ mã này với bất kỳ ai.
      </p>

    </div>
  </div>
  `;
};
