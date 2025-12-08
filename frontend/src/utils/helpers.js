import axios from "axios";

const API_BASE = "https://truestate-cn56.onrender.com/api"; // replace with your backend URL

export const fetchSales = async (params = {}) => {
  try {
    const res = await axios.get(`${API_BASE}/sales`, { params });
    return res.data;
  } catch (err) {
    console.error("API Error:", err);
    return { data: [], total: 0 };
  }
};
