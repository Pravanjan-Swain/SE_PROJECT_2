import express from "express";
import { connectDB } from "./utils/db";
import cookieParser from "cookie-parser";

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})