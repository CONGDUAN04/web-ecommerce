import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import authRouter from './routes/api.auth.js';
import userRoutes from './routes/user/index.user.js'
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 8081;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// parse body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static file
app.use(express.static("public"));

// routes
app.use("/", userRoutes)
app.use('/api/admin', router);
app.use('/api', authRouter);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
