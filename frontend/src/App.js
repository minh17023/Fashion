import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// 🛒 Trang khách hàng
import TrangChu from "./pages/TrangChu";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CategoryPage from "./pages/CategoryPage";
import ThongTinTaiKhoan from "./pages/ThongTinTK";
import SearchPage from "./pages/SearchPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ThankYouPage from "./pages/ThankYouPage";

// 🛠 Trang admin
import AdminLoginPage from './pages/admin/AdminLoginPage';
import RequireAdminAuth from './components/admin/RequireAdminAuth';
import AdminLayout from './components/admin/AdminLayout'; 
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ProductsPage from './pages/admin/ProductsPage';
import OrdersPage from './pages/admin/OrdersPage';
import UsersPage from './pages/admin/UsersPage';
import CategoriesPage from './pages/admin/CategoriesPage';

function App() {
  const location = useLocation();
  const isAdminLogin = location.pathname === "/admin/login";
  const isAdmin = location.pathname.startsWith("/admin") && !isAdminLogin;

  // 🔁 Đổi tiêu đề tab theo route
  useEffect(() => {
    if (isAdminLogin) {
      document.title = "Đăng nhập quản trị";
    } else if (isAdmin) {
      document.title = "Trang quản trị";
    } else {
      document.title = "Fashion Shop";
    }
  }, [isAdminLogin, isAdmin]);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Ẩn header/footer nếu là trang admin hoặc admin login */}
      {!isAdmin && !isAdminLogin && <Header />}

      <main className="flex-grow-1" style={{ marginTop: !isAdmin && !isAdminLogin ? "55px" : "0" }}>
        <Routes>
          {/* 👤 Trang người dùng */}
          <Route path="/" element={<TrangChu />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/me" element={<ThongTinTaiKhoan />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />

          {/* 🛠 Admin Login */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* 🛠 Admin Layout (Yêu cầu xác thực) */}
          <Route path="/admin" element={
            <RequireAdminAuth>
              <AdminLayout />
            </RequireAdminAuth>
          }>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="categories" element={<CategoriesPage />} />
          </Route>
        </Routes>
      </main>

      {!isAdmin && !isAdminLogin && <Footer />}
    </div>
  );
}

export default App;
