import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <AdminHeader />
      <div className="d-flex flex-grow-1">
        <AdminSidebar />
        <main className="flex-grow-1 w-100 p-4 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
