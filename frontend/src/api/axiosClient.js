import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8000", // Thay bằng địa chỉ backend nếu khác
  headers: {
    "Content-Type": "application/json",
  },
});

// Gắn token tự động nếu có
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Bắt lỗi response (ví dụ 401 Unauthorized)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      !window.location.pathname.includes("/login")
    ) {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      localStorage.removeItem("access_token");
      window.location.href = "/login"; // chuyển hướng
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
