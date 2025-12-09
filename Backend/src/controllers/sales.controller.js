import { getSalesData } from "../services/sales.service.js";
import { SalesRecord } from "../models/SalesRecord.js";

// Get sales with filters, pagination, sorting
export const getSales = async (req, res) => {
  try {
    const response = await getSalesData(req.query);
    res.json(response);
  } catch (err) {
    console.error("❌ Controller Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Dashboard aggregation
export const getDashboard = async (req, res) => {
  try {
    const result = await SalesRecord.aggregate([
      {
        $group: {
          _id: null,
          totalUnits: { $sum: { $toDouble: "$Quantity" } },
          totalAmount: { $sum: { $toDouble: "$Final Amount" } },
          totalDiscount: {
            $sum: {
              $multiply: [
                { $toDouble: "$Quantity" },
                { $toDouble: "$Price per Unit" },
                { $divide: [{ $toDouble: "$Discount Percentage" }, 100] },
              ],
            },
          },
        },
      },
    ]);

    res.json(result[0] || { totalUnits: 0, totalAmount: 0, totalDiscount: 0 });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
