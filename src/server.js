import express from 'express';
import dotenv from 'dotenv';
import { json, urlencoded } from 'express';
import router from './routes/index.js';
import cors from 'cors';

dotenv.config();
const app = express();
const port = process.env.PORT || 8081;

app.use(cors());
// Config req.body (CHỈ cho non-file routes)
app.use(express.json());
app.use(urlencoded({ extended: true }));
// Config static files
app.use(express.static("public"));
// Config router
app.use('/api', router);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});