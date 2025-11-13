import express from 'express';
import { postCreateUser } from '../controllers/user.controller.js';
const router = express.Router();

const apiRoutes = (app) => {
    router.post("/users", postCreateUser);
    app.use("/api", router);
}

export default apiRoutes;