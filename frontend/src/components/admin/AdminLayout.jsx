import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen d-flex flex-column">
      <AdminHeader />
      <div className="d-flex flex-grow-1">
        <AdminSidebar />
        <main className="flex-grow-1 p-4 bg-white">
          <Outlet />  
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
