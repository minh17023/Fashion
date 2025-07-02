// src/pages/admin/AdminDashboardPage.jsx
import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminDashboardPage = () => {
  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">Xin chào quản trị viên</h2>
      <p>Đây là trang tổng quan.</p>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
