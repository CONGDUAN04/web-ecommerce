import express from 'express';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import { json, urlencoded } from 'express';
import router from './routes/index.js';
import cors from 'cors';
dotenv.config();
const app = express();
const port = process.env.PORT || 8081;
app.use(cors());
// Config file upload
app.use(fileUpload());
// Config req.body
app.use(express.json());
app.use(json());
app.use(urlencoded({ extended: true }));
//config static files
app.use(express.static("public"));
// Config router
app.use('/api', router);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
