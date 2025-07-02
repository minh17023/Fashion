// src/pages/admin/OrdersPage.jsx
import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const OrdersPage = () => {
  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h2>
      <p>Thông tin đơn hàng sẽ được hiển thị tại đây.</p>
    </AdminLayout>
  );
};

export default OrdersPage;
