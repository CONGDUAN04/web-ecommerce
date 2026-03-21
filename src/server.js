import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import adminRoutes from './routes/admin/index.js';
import authRouter from './routes/api.auth.js';
import userRoutes from './routes/user/index.js';
import { checkValidJWT, isAdmin } from './middleware/jwt.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 8081;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

/* ---------- PUBLIC ---------- */
app.use('/api', authRouter);

/* ---------- USER (login required) ---------- */
app.use('/user', checkValidJWT, userRoutes);

/* ---------- ADMIN (admin required) ---------- */
app.use('/api/admin', checkValidJWT, isAdmin, adminRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});