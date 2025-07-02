import axiosClient from "./axiosClient";

export const createOrder = (orderData) => {
  return axiosClient.post("/orders", orderData);
};

export const getMyOrders = () => {
  return axiosClient.get("/orders/my");
};
