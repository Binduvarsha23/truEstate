import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // ✅ import cors
import { connectDB } from "./utils/db.js";
import salesRoutes from "./routes/sales.routes.js";

dotenv.config();
const app = express();
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: "*" // For development: allows any frontend. In production, replace "*" with your frontend URL
}));

// Connect MongoDB
await connectDB();

// Routes
app.use("/api/sales", salesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
