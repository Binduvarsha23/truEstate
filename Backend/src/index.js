import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import salesRoutes from "./routes/sales.routes.js";

dotenv.config();
const app = express();
app.use(express.json());

// Connect MongoDB
await connectDB();

// Routes
app.use("/api/sales", salesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
