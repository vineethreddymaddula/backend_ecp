import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import orderRoutes from './routes/order.routes'


// Import routes
import productRoutes from "./routes/product.routes"; // <-- IMPORT THE ROUTER

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// A simple test route
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running!" });
});

// Use the product routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/orders', orderRoutes);

export default app;
