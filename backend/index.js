import express from "express";
import {connectDB} from './utils/db.js'
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import customerRoutes from "./routes/customer.route.js";
import managerRoutes from "./routes/manager.route.js";
import delivererRoutes from "./routes/deliverer.route.js";

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());

// Configure routes
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/deliverer', delivererRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})