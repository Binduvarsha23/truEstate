import express from "express";
import { fetchSales } from "../controllers/sales.controller.js";

const router = express.Router();

router.get("/", fetchSales);

export default router;
