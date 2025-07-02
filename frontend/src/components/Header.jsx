import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Header() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      axios
        .get("http://localhost:8000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("access_token");
          setUser(null);
        });
    }

    fetchCartCount(); // Gọi lại khi route thay đổi
  }, [location]);

  const fetchCartCount = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:8000/cart/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = res.data?.items || [];
      const total = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    } catch (err) {
      console.error("Không thể lấy giỏ hàng:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 fixed-top">
      <Link className="navbar-brand" to="/">🛍️ Shop Fashion</Link>

      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Trang chủ</Link>
          </li>
          <li className="nav-item"><Link className="nav-link" to="/category/1">Áo</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/category/2">Quần</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/category/3">Phụ kiện</Link></li>
        </ul>

        {/* Thanh tìm kiếm */}
        <form className="d-flex me-3" onSubmit={handleSearch}>
          <input
            type="text"
            className="form-control me-2"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-outline-light" type="submit">Tìm</button>
        </form>

        {/* Giỏ hàng và người dùng */}
        <ul className="navbar-nav">
          <li className="nav-item position-relative me-3">
            <Link className="nav-link" to="/cart">
              🛒    
              {cartCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.6rem" }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </li>

          {user ? (
            <li className="nav-item dropdown">
              <button
                className="btn btn-link nav-link dropdown-toggle text-white"
                data-bs-toggle="dropdown"
              >
                {user.username}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><Link className="dropdown-item" to="/me">Thông tin tài khoản</Link></li>
                <li><button className="dropdown-item" onClick={handleLogout}>Đăng xuất</button></li>
              </ul>
            </li>
          ) : (
            <li className="nav-item">
              <Link className="nav-link" to="/login">Đăng nhập</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Header;
