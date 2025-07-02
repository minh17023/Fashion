import axiosClient from "./axiosClient";

// Đăng ký
export const registerUser = async (userData) => {
  const res = await axiosClient.post("/auth/register", userData);
  return res.data;
};

// Đăng nhập
export const loginUser = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const res = await axiosClient.post("/auth/login", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data;
};

// Lấy thông tin người dùng hiện tại
export const getCurrentUser = async () => {
  const res = await axiosClient.get("/auth/me");
  return res.data;
};

// Dữ liệu dành riêng cho admin
export const getAdminData = async () => {
  const res = await axiosClient.get("/auth/admin");
  return res.data;
};
