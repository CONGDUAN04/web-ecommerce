import express from 'express';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import { json, urlencoded } from 'express';
import apiRoutes from './routes/api.user.js';
dotenv.config();
const app = express();
const port = process.env.PORT || 8081;

// Config file upload
app.use(fileUpload());
// Config req.body
app.use(json());
app.use(urlencoded({ extended: true }));
//config static files
app.use(express.static("public"));
apiRoutes(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
