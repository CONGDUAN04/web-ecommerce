import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.PORT || 8081;

// Config file upload
app.use(fileUpload());
// Config req.body
app.use(json());
app.use(urlencoded({ extended: true }));

app.get('/', () => {
    return "Hello World"
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
