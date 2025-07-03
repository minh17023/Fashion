import React, { useEffect, useState } from "react";
import {
  getAllOrders,
  adminShipOrder,
  adminAcceptCancel,
  adminAcceptReturn,
} from "../../api/order";
import { Form, Table, Pagination, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Import context
import { useOrderContext } from "../../contexts/OrderContext";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 5;

  const { refreshFlag, triggerRefresh } = useOrderContext(); // ✅ dùng context để đồng bộ

  useEffect(() => {
    fetchOrders();
  }, [refreshFlag]); // ✅ tự động gọi lại khi nơi khác thay đổi đơn hàng

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data || []);
    } catch (err) {
      toast.error("Không thể lấy danh sách đơn hàng!");
      console.error("Lỗi khi lấy đơn hàng:", err);
    }
  };

  const handleAction = async (orderId, type) => {
    try {
      if (type === "ship") await adminShipOrder(orderId);
      else if (type === "acceptCancel") await adminAcceptCancel(orderId);
      else if (type === "acceptReturn") await adminAcceptReturn(orderId);

      toast.success("✅ Cập nhật trạng thái thành công!");
      triggerRefresh(); // ✅ notify toàn hệ thống (client side)
      fetchOrders();     // ✅ cập nhật lại chính trang này
    } catch (err) {
      toast.error("❌ Thao tác thất bại!");
      console.error(err);
    }
  };

  const statusBadge = (status) => {
    const s = status?.toLowerCase?.();
    const colors = {
      pending: "secondary",
      paid: "primary",
      shipped: "info",
      completed: "success",
      canceled: "danger",
      returned: "warning",
      cancel_requested: "danger",
      return_requested: "warning",
    };
    return (
      <span className={`badge bg-${colors[s] || "light"} text-uppercase`}>
        {status}
      </span>
    );
  };

  const filtered = orders.filter((o) =>
    o.receiver_name?.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <ToastContainer />
      <h4 className="mb-3">📦 Quản lý đơn hàng</h4>

      <Form.Control
        className="w-50 mb-3"
        placeholder="🔍 Tìm theo người nhận..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Table bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th>STT</th>
            <th>Người nhận</th>
            <th>Địa chỉ</th>
            <th>Ngày đặt</th>
            <th>Trạng thái</th>
            <th>Tổng tiền</th>
            <th>Sản phẩm</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length > 0 ? (
            paginated.map((order, i) => (
              <tr key={order.id}>
                <td>{(page - 1) * perPage + i + 1}</td>
                <td>{order.receiver_name}</td>
                <td>{order.shipping_address}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
                <td>{statusBadge(order.status)}</td>
                <td className="text-danger fw-bold">
                  {Number(order.total_amount || 0).toLocaleString()} VNĐ
                </td>
                <td>
                  <ul className="list-unstyled mb-0">
                    {(order.items || []).map((item) => (
                      <li key={item.id}>
                        #{item.product_id} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  {order.status === "paid" && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleAction(order.id, "ship")}
                    >
                      Giao hàng
                    </Button>
                  )}
                  {order.status === "cancel_requested" && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleAction(order.id, "acceptCancel")}
                    >
                      Xác nhận hủy
                    </Button>
                  )}
                  {order.status === "return_requested" && (
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => handleAction(order.id, "acceptReturn")}
                    >
                      Xác nhận hoàn
                    </Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center text-muted">
                Không tìm thấy đơn hàng nào.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {filtered.length > perPage && (
        <Pagination className="justify-content-start">
          {Array.from({ length: Math.ceil(filtered.length / perPage) }).map((_, i) => (
            <Pagination.Item
              key={i}
              active={page === i + 1}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </div>
  );
};

export default OrdersPage;
