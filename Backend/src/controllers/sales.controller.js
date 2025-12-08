import { SalesRecord } from "../models/SalesRecord.js";

// Dashboard aggregation
export const getDashboard = async (req, res) => {
  try {
    const result = await SalesRecord.aggregate([
      {
        $group: {
          _id: null,
          totalUnits: { $sum: "$Quantity" },
          totalAmount: { $sum: "$Final Amount" },
          totalDiscount: {
            $sum: {
              $multiply: ["$Quantity", "$Price per Unit", { $divide: ["$Discount Percentage", 100] }]
            }
          }
        }
      }
    ]);

    const dashboard = result[0] || { totalUnits: 0, totalAmount: 0, totalDiscount: 0 };
    res.json(dashboard);
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

