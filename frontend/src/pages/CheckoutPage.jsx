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
        setCart(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy giỏ hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleOrder = async () => {
    if (!receiverName || !receiverPhone || !shippingAddress) {
      alert("Vui lòng nhập đầy đủ thông tin người nhận.");
      return;
    }

    if (!Array.isArray(cart?.items) || cart.items.length === 0) {
      alert("Giỏ hàng trống. Không thể đặt hàng.");
      return;
    }

    try {
      await createOrder({
        receiver_name: receiverName,
        receiver_phone: receiverPhone,
        shipping_address: shippingAddress,
      });
      alert("✅ Đặt hàng thành công!");
      navigate("/thank-you");
    } catch (err) {
      console.error("❌ Lỗi khi đặt hàng:", err);
      alert("Đặt hàng thất bại. Vui lòng thử lại.");
    }
  };

  const total = Array.isArray(cart?.items)
    ? cart.items.reduce(
        (sum, item) => sum + item.quantity * (item.product?.price || 0),
        0
      )
    : 0;

  if (loading) return <div className="text-center mt-4">Đang tải giỏ hàng...</div>;

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
                  className="list-group-item d-flex align-items-center"
                >
                  <img
                    src={
                      item.product?.img?.startsWith("http")
                        ? item.product.img
                        : `http://localhost:8000${item.product?.img || ""}`
                    }
                    alt={item.product?.name}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      marginRight: "15px",
                    }}
                  />

                  <div className="flex-grow-1">
                    <div>
                      <strong>{item.product?.name}</strong> x {item.quantity}
                    </div>
                    <div className="text-muted" style={{ fontSize: "14px" }}>
                      ₫{item.product?.price?.toLocaleString()} / sản phẩm
                    </div>
                  </div>
                  <div className="text-danger fw-bold">
                    ₫{(item.quantity * (item.product?.price || 0)).toLocaleString()}
                  </div>
                </li>
              ))}
              <li className="list-group-item text-end">
                <strong>Tổng cộng: </strong>
                <span className="text-danger">{total.toLocaleString()} VNĐ</span>
              </li>
            </ul>
          ) : (
            <p className="text-danger bg-light p-2 rounded">
              Giỏ hàng trống. Không thể thanh toán khi chưa có sản phẩm.
            </p>
          )}
        </div>

        {/* Thông tin nhận hàng */}
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
              onChange={(e) => {
                const val = e.target.value;
                // Chỉ cho phép số và tối đa 10 ký tự
                if (/^\d{0,10}$/.test(val)) {
                  setReceiverPhone(val);
                }
              }}
              maxLength={10}
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
