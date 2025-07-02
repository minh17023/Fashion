import React, { useEffect, useState } from "react";
import { getAllOrders } from "../api/order";
import { getAllUsers } from "../api/user";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, usersRes] = await Promise.all([
          getAllOrders(),   // Giả định bạn có API admin xem toàn bộ đơn
          getAllUsers(),    // Giả định bạn có API lấy danh sách người dùng
        ]);
        setOrders(ordersRes);
        setUsers(usersRes);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);

  if (loading) return <div className="text-center mt-5">Đang tải dữ liệu...</div>;

  return (
    <div className="container mt-4">
      <h2>📊 Admin Dashboard</h2>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Tổng đơn hàng</h5>
              <p className="card-text display-6">{orders.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Tổng doanh thu</h5>
              <p className="card-text display-6">
                {totalRevenue.toLocaleString()} VNĐ
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-dark mb-3">
            <div className="card-body">
              <h5 className="card-title">Tổng người dùng</h5>
              <p className="card-text display-6">{users.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách đơn hàng gần đây */}
      <div className="mt-5">
        <h4>🧾 Đơn hàng gần đây</h4>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Mã ĐH</th>
              <th>Khách hàng</th>
              <th>Trạng thái</th>
              <th>Tổng tiền</th>
              <th>Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 10).map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.receiver_name}</td>
                <td>{order.status}</td>
                <td>{order.total_amount.toLocaleString()} VNĐ</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
