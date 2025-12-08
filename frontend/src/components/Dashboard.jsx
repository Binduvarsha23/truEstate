// Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [totals, setTotals] = useState({
    totalUnits: 0,
    totalAmount: 0,
    totalDiscount: 0,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axios.get(
          "https://truestate-cn56.onrender.com/api/sales/dashboard"
        );
        setTotals(data);
      } catch (err) {
        console.error("Dashboard fetch error", err);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <div>Total Units Sold: {totals.totalUnits}</div>
      <div>Total Amount: ${totals.totalAmount.toLocaleString()}</div>
      <div>Total Discount: ${totals.totalDiscount.toLocaleString()}</div>
    </div>
  );
};

export default Dashboard;
