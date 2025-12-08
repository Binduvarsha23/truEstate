import axios from "axios";

const BASE_URL = "https://truestate-cn56.onrender.com/api/sales";

export const fetchDashboard = async () => {
  const { data } = await axios.get(`${BASE_URL}/dashboard`);
  return data;
};

export const fetchSales = async (params) => {
  const { data } = await axios.get(BASE_URL, { params });
  return data;
};
