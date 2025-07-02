import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../api/auth";

function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Nếu có token từ Google, lưu và điều hướng về trang chủ
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    if (token) {
      localStorage.setItem("access_token", token);
      navigate("/"); // về trang chủ để Header load lại và hiển thị user
    }
  }, [location, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      try {
        const res = await loginUser(form.username, form.password);
        localStorage.setItem("access_token", res.access_token);
        alert("Đăng nhập thành công!");
        navigate("/");
      } catch (err) {
        if (err?.response?.status === 403) {
          setError("Tài khoản của bạn đã bị vô hiệu hóa.");
        } else if (err?.response?.status === 401) {
          setError("Sai tên đăng nhập hoặc mật khẩu.");
        } else {
          setError("Lỗi đăng nhập. Vui lòng thử lại.");
        }
      }
    };    

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/auth/google-login";
  };

  return (
    <div className="card p-4 mx-auto mt-5 shadow" style={{ maxWidth: "400px" }}>
      <h3 className="text-center mb-4">Đăng nhập</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Tên đăng nhập</label>
          <input
            className="form-control"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Mật khẩu</label>
          <input
            className="form-control"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary w-100">
          Đăng nhập
        </button>

        <button
          type="button"
          className="btn btn-outline-danger w-100 mt-2"
          onClick={handleGoogleLogin}
        >
          Đăng nhập bằng Google
        </button>
        <button
          type="button"
          className="btn btn-outline-primary w-100 mt-2"
          onClick={() => window.location.href = "http://localhost:8000/auth/facebook-login"}
        >
          Đăng nhập bằng Facebook
        </button>
        <p className="mt-3 text-center">
          Chưa có tài khoản? <a href="/register">Đăng ký</a>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
