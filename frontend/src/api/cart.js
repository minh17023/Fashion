import axiosClient from "./axiosClient";

// Lấy giỏ hàng của người dùng
export const getMyCart = () => {
  return axiosClient.get("/cart/me");
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = (productId, quantity = 1) => {
  return axiosClient.post("/cart/add", {
    product_id: productId,
    quantity: quantity,
  });
};

// Cập nhật số lượng sản phẩm trong giỏ
export const updateCartItem = (itemId, quantity) => {
  return axiosClient.put(`/cart/item/${itemId}`, {
    product_id: 0, // có thể bỏ nếu backend không yêu cầu
    quantity: quantity,
  });
};

// Xóa 1 item khỏi giỏ
export const deleteCartItem = (itemId) => {
  return axiosClient.delete(`/cart/item/${itemId}`);
};

// Xóa toàn bộ giỏ hàng
export const clearCart = () => {
  return axiosClient.delete(`/cart/clear`);
};
