import React, { useEffect, useState } from "react";
import axios from "axios";

function ThongTinTaiKhoan() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      axios.get("http://localhost:8000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setUser(res.data))
      .catch(err => setError("Không thể lấy thông tin người dùng"));
    } else {
      setError("Bạn chưa đăng nhập.");
    }
  }, []);

  if (error) return <div className="alert alert-danger mt-4 text-center">{error}</div>;

  if (!user) return <div className="text-center mt-4">Đang tải thông tin...</div>;

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4 text-center">Thông tin tài khoản</h3>
      <div className="card p-4 shadow">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Tên đăng nhập:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Vai trò:</strong> {user.role === "admin" ? "Quản trị viên" : "Người dùng"}</p>
      </div>
    </div>
  );
}

export default ThongTinTaiKhoan;
