import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <aside className="bg-light border-end" style={{ width: '250px', minHeight: '100vh' }}>
      <div className="p-3">
        <h5 className="mb-4 fw-bold text-primary">📋 Menu quản trị</h5>
        <div className="nav flex-column nav-pills">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : 'text-dark'}`
            }
          >
            📊 Bảng điều khiển
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : 'text-dark'}`
            }
          >
            🛍️ Sản phẩm
          </NavLink>
          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : 'text-dark'}`
            }
          >
            🗂️ Danh mục
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : 'text-dark'}`
            }
          >
            📦 Đơn hàng
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : 'text-dark'}`
            }
          >
            👥 Người dùng
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
