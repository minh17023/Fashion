import axios from "axios";

const API_BASE = "http://localhost:8000";

export const getCategories = async () => {
  const res = await axios.get(`${API_BASE}/categories`);
  return res.data;
};

export const addCategorie = (data) => axios.post(`${API_BASE}/categories`, data);
export const updateCategorie = (id, data) => axios.put(`${API_BASE}/categories/${id}`, data);
export const deleteCategorie = (id) => axios.delete(`${API_BASE}/categories/${id}`);
