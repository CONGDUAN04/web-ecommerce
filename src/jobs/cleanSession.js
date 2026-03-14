import cron from "node-cron";
import { deleteExpiredSessions } from "../services/session.services.js";

// Chạy lúc 2:00 AM mỗi ngày
cron.schedule("0 2 * * *", async () => {
    try {
        const count = await deleteExpiredSessions();
        console.log(`[CRON] ${new Date().toISOString()} — Đã xóa ${count} session hết hạn`);
    } catch (error) {
        console.error("[CRON] Lỗi khi dọn session:", error.message);
    }
});

console.log("[CRON] Clean session job đã được đăng ký (chạy lúc 2:00 AM mỗi ngày)");