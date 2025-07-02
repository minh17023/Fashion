import axios from "axios";
const API_BASE = "http://localhost:8000";

export const getAllProducts = async () => {
  const res = await axios.get(`${API_BASE}/products`);
  return res.data;
};

export const addProduct = (data) =>
  axios.post(`${API_BASE}/products`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateProduct = (id, data) =>
  axios.put(`${API_BASE}/products/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteProduct = (id) =>
  axios.delete(`${API_BASE}/products/${id}`);
