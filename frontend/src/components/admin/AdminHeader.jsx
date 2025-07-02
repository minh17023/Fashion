import React from 'react';

const AdminHeader = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <a className="navbar-brand" href="/admin/dashboard">
        🛠️ Quản Trị
      </a>
      <div className="ms-auto">
        <button
          className="btn btn-outline-light"
          onClick={() => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('admin_logged_in');
            window.location.href = '/admin/login';
          }}
        >
          Đăng xuất
        </button>
      </div>
    </nav>
  );
};

export default AdminHeader;
