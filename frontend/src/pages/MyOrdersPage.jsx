import React, { useEffect, useState } from "react";
import {
  getMyOrders,
  confirmOrder,
  requestCancelOrder,
  requestReturnOrder,
  payOrder,
} from "../api/order";

// ✅ Import context để đồng bộ dữ liệu
import { useOrderContext } from "../contexts/OrderContext";

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refreshFlag, triggerRefresh } = useOrderContext(); // ✅ Hook từ context

  useEffect(() => {
    fetchOrders();
  }, [refreshFlag]); // ✅ Tự động cập nhật khi trang khác trigger

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (orderId, actionFn) => {
    try {
      const confirmed = window.confirm("Bạn có chắc chắn thực hiện thao tác này?");
      if (!confirmed) return;

      await actionFn(orderId);
      alert("Cập nhật trạng thái thành công!");
      triggerRefresh(); // ✅ Thông báo các trang khác cập nhật lại
      fetchOrders();    // ✅ Cập nhật lại chính trang này
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      alert("Thao tác thất bại.");
    }
  };

  if (loading) return <div className="text-center mt-4">Đang tải dữ liệu...</div>;

  return (
    <div className="container mt-4">
      <h3>📅 Đơn hàng của bạn</h3>
      {orders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered mt-3">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Ngày đặt</th>
                <th>Trạng thái</th>
                <th>Tổng tiền</th>
                <th>Sản phẩm</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const status = order.status.toLowerCase();

                return (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{new Date(order.created_at).toLocaleString()}</td>
                    <td>
                      <span className="badge bg-info text-dark">{status}</span>
                    </td>
                    <td className="text-danger">
                      {Number(order.total_amount || 0).toLocaleString()} VNĐ
                    </td>
                    <td>
                      <ul className="list-unstyled mb-0">
                        {(order.items || []).map((item) => (
                          <li key={item.id}>
                            SP #{item.product_id} x {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      {status === "pending" && (
                        <>
                          <button
                            className="btn btn-warning btn-sm me-1 mb-1"
                            onClick={() => handleAction(order.id, requestCancelOrder)}
                          >
                            Huỷ đơn
                          </button>
                          <button
                            className="btn btn-primary btn-sm mb-1"
                            onClick={() => handleAction(order.id, payOrder)}
                          >
                            Thanh toán
                          </button>
                        </>
                      )}

                      {status === "shipped" && (
                        <button
                          className="btn btn-success btn-sm mb-1"
                          onClick={() => handleAction(order.id, confirmOrder)}
                        >
                          Đã nhận
                        </button>
                      )}

                      {status === "completed" && (
                        <button
                          className="btn btn-info btn-sm mb-1"
                          onClick={() => handleAction(order.id, requestReturnOrder)}
                        >
                          Hoàn trả
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyOrdersPage;
