import React, { useEffect, useState } from "react";
import { getMyCart } from "../api/cart";
import { createOrder } from "../api/order";
import { useNavigate } from "react-router-dom";

function CheckoutPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await getMyCart();
        console.log("Dữ liệu giỏ hàng:", res); // Debug
        setCart(res);
      } catch (err) {
        console.error("Lỗi khi lấy giỏ hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleOrder = async () => {
    try {
      if (!receiverName || !receiverPhone || !shippingAddress) {
        alert("Vui lòng nhập đầy đủ thông tin người nhận.");
        return;
      }

      if (!Array.isArray(cart?.items) || cart.items.length === 0) {
        alert("Giỏ hàng trống. Không thể đặt hàng.");
        return;
      }

      await createOrder({
        receiver_name: receiverName,
        receiver_phone: receiverPhone,
        shipping_address: shippingAddress,
      });

      alert("Đặt hàng thành công!");
      navigate("/thankyou");
    } catch (err) {
      console.error("Lỗi khi đặt hàng:", err);
      alert("Đặt hàng thất bại. Vui lòng thử lại.");
    }
  };

  const total = Array.isArray(cart?.items)
    ? cart.items.reduce(
        (sum, item) => sum + item.quantity * (item.product?.price || 0),
        0
      )
    : 0;

  if (loading) return <div className="text-center mt-4">Đang tải...</div>;

  return (
    <div className="container mt-4">
      <h3>🧾 Thanh toán đơn hàng</h3>
      <div className="row">
        {/* Danh sách sản phẩm */}
        <div className="col-md-7">
          <h5>Sản phẩm trong giỏ hàng</h5>
          {Array.isArray(cart?.items) && cart.items.length > 0 ? (
            <ul className="list-group mb-3">
              {cart.items.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{item.product?.name}</strong> x {item.quantity}
                  </div>
                  <span className="text-danger">
                    {(item.quantity * (item.product?.price || 0)).toLocaleString()} VNĐ
                  </span>
                </li>
              ))}
              <li className="list-group-item text-end">
                <strong>Tổng cộng: </strong>
                <span className="text-danger">
                  {total.toLocaleString()} VNĐ
                </span>
              </li>
            </ul>
          ) : (
            <p>Giỏ hàng trống. Không thể thanh toán khi chưa có sản phẩm.</p>
          )}
        </div>

        {/* Form địa chỉ */}
        <div className="col-md-5">
          <h5>Thông tin nhận hàng</h5>
          <div className="mb-3">
            <label className="form-label">Tên người nhận</label>
            <input
              type="text"
              className="form-control"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Số điện thoại</label>
            <input
              type="text"
              className="form-control"
              value={receiverPhone}
              onChange={(e) => setReceiverPhone(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Địa chỉ giao hàng</label>
            <textarea
              className="form-control"
              rows="3"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
            />
          </div>
          <button className="btn btn-danger w-100" onClick={handleOrder}>
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
