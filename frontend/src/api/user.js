import axios from "./axiosClient";

export const getAllUsers = async () => {
  const res = await axios.get("/users/");
  return res.data;
};

export const getUser = async (id) => {
  const res = await axios.get(`/users/${id}`);
  return res.data;
};

export const addUser = async (user) => {
  const res = await axios.post("/users/", user);
  return res.data;
};

export const updateUser = async (id, user) => {
  const res = await axios.put(`/users/${id}`, user);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await axios.delete(`/users/${id}`);
  return res.data;
};
