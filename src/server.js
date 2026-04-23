import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import adminRoutes from "./routes/admin/index.js";
import authRouter from "./routes/client/api.auth.js";
import clientRoutes from "./routes/client/index.js";
import uploadRoutes from "./routes/upload/api.upload.js";
import { checkValidJWT, isAdmin } from "./middleware/jwt.js";
import { errorHandler } from "./middleware/errorHandler.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 8081;

/* ---------- SECURITY ---------- */
app.use(helmet());

// Rate limiter cho auth endpoints
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.body?.email || "unknown",
  handler: (req, res) => {
    const secondsLeft = Math.ceil(
      (req.rateLimit.resetTime - Date.now()) / 1000,
    );
    const minutesLeft = Math.ceil(secondsLeft / 60);
    return res.status(429).json({
      success: false,
      message: `Quá nhiều lần đăng nhập. Vui lòng thử lại sau ${minutesLeft} phút`,
      retryAfter: secondsLeft,
    });
  },
});

/* ---------- MIDDLEWARE ---------- */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

/* ---------- ROUTES ---------- */

/* PUBLIC */
app.use("/api/login", authLimiter, authRouter);
app.use("/api/register", authLimiter, authRouter);
app.use("/api", authRouter);

/* UPLOAD */
app.use("/api/upload", checkValidJWT, uploadRoutes);

/* USER */
app.use("/api", checkValidJWT, clientRoutes);

/* ADMIN */
app.use("/api/admin", checkValidJWT, isAdmin, adminRoutes);

/* ERROR HANDLER */
app.use(errorHandler);

/* ---------- START SERVER ---------- */
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

export default app;
