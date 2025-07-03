import axiosClient from "./axiosClient";

// ------------------- USER APIs -------------------

// Đặt hàng từ giỏ hàng
export const createOrder = (orderData) => {
  return axiosClient.post("/orders/", orderData);
};

// Mua ngay 1 sản phẩm
export const buyNow = (payload) => {
  return axiosClient.post("/orders/buy-now", payload);
};

// Lấy đơn hàng của người dùng hiện tại
export const getMyOrders = () => {
  return axiosClient.get("/orders/me");
};

// Giả lập thanh toán
export const payOrder = (orderId) => {
  return axiosClient.post(`/orders/${orderId}/pay`);
};

// Xác nhận đã nhận hàng
export const confirmOrder = (orderId) => {
  return axiosClient.post(`/orders/${orderId}/confirm`);
};

// Yêu cầu huỷ đơn
export const requestCancelOrder = (orderId) => {
  return axiosClient.post(`/orders/${orderId}/cancel`);
};

// Yêu cầu hoàn trả đơn hàng
export const requestReturnOrder = (orderId) => {
  return axiosClient.post(`/orders/${orderId}/return`);
};

// ------------------- ADMIN APIs -------------------

// Lấy tất cả đơn hàng
export const getAllOrders = () => {
  return axiosClient.get("/orders/all");
};

// Admin xác nhận huỷ đơn
export const adminAcceptCancel = (orderId) => {
  return axiosClient.post(`/orders/${orderId}/accept-cancel`);
};

// Admin xác nhận đang giao hàng
export const adminShipOrder = (orderId) => {
  return axiosClient.post(`/orders/${orderId}/ship`);
};

// Admin chấp nhận hoàn trả
export const adminAcceptReturn = (orderId) => {
  return axiosClient.post(`/orders/${orderId}/accept-return`);
};

// ------------------- STATS -------------------

// API thống kê doanh thu và hủy đơn
export const getOrderStats = () => {
  return axiosClient.get("/orders/stats");
};
