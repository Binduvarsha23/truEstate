import { getSalesData } from "../services/sales.service.js";

export const fetchSales = async (req, res) => {
  try {
    const response = await getSalesData(req.query);
    res.json(response);
  } catch (err) {
    console.error("❌ Controller Error", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
