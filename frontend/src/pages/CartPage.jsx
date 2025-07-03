import React, { useEffect, useState } from "react";
import { getMyCart, deleteCartItem, updateCartItem } from "../api/cart";
import { Link, useNavigate } from "react-router-dom";

function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

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

  const handleRemove = async (itemId) => {
    try {
      await deleteCartItem(itemId);
      await fetchCart();
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      if (newQuantity < 1) return;
      await updateCartItem(itemId, newQuantity);
      await fetchCart();
    } catch (err) {
      console.error("❌ Lỗi cập nhật số lượng:", err);
    }
  };

  const total = cart?.items?.reduce(
    (sum, item) => sum + item.quantity * (item.product?.price || 0),
    0
  );

  if (loading)
    return <div className="text-center mt-5">Đang tải giỏ hàng...</div>;

  return (
    <div className="container mt-4">
      <h3>🛒 Giỏ hàng của bạn</h3>
      {cart?.items?.length > 0 ? (
        <>
          <table className="table table-bordered align-middle mt-3">
            <thead className="table-dark">
              <tr>
                <th>Ảnh</th>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tổng</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item.id}>
                  <td style={{ width: "100px" }}>
                    <div style={{ width: "100px", aspectRatio: "1", position: "relative" }}>
                      <img
                        src={
                          item.product?.img?.startsWith("http")
                            ? item.product.img
                            : `http://localhost:8000${item.product?.img}`
                        }
                        alt={item.product?.name}
                        className="img-fluid rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/default.png";
                        }}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                          borderRadius: "8px",
                          position: "absolute",
                          top: 0,
                          left: 0,
                        }}
                      />
                    </div>
                  </td>
                  <td>{item.product?.name}</td>
                  <td>{item.product?.price?.toLocaleString()} VNĐ</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, Number(e.target.value))
                      }
                      className="form-control form-control-sm"
                      style={{ width: "70px" }}
                    />
                  </td>
                  <td>
                    {(item.product?.price * item.quantity).toLocaleString()} VNĐ
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemove(item.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-end">
            <h5>
              Tổng cộng:{" "}
              <span className="text-danger">
                {total?.toLocaleString()} VNĐ
              </span>
            </h5>
            <button
              className="btn btn-success mt-2"
              onClick={() => navigate("/checkout")}
            >
              Thanh toán
            </button>
          </div>
        </>
      ) : (
        <p>
          Giỏ hàng của bạn đang trống. <Link to="/">Mua sắm ngay</Link>.
        </p>
      )}
    </div>
  );
}

export default CartPage;
