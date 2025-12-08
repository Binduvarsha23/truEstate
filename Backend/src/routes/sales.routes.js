import express from "express";
import { getSales, getDashboard } from "../controllers/sales.controller.js";

const router = express.Router();

router.get("/", getSales); // existing sales list
router.get("/dashboard", getDashboard); // new route

export default router;
