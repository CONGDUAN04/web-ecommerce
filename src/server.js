import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
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
app.use("/api/login", authRouter);
app.use("/api/register", authRouter);
/* PUBLIC AUTH */
app.use("/api", authRouter);

/* UPLOAD */
app.use("/api/upload", checkValidJWT, uploadRoutes);

/* USER - protected */
app.use("/api/user", checkValidJWT, clientRoutes); // đổi prefix rõ ràng hơn

/* ADMIN */
app.use("/api/admin", checkValidJWT, isAdmin, adminRoutes);

/* ERROR HANDLER */
app.use(errorHandler);

/* ---------- START SERVER ---------- */
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

export default app;
