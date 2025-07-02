import axios from "axios";

const API_BASE = "http://localhost:8000";

export const getAllProducts = async () => {
  const res = await axios.get(`${API_BASE}/products`);
  return res.data;
};
