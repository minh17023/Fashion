import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { addToCart } from "../api/cart";

function ProductDetailPage() {
  const { id } = useParams(); // Lấy product ID từ URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8000/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Lỗi lấy sản phẩm:", err));
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity);
      setMessage("✅ Đã thêm vào giỏ hàng!");
    } catch (err) {
      console.error("Lỗi thêm giỏ hàng:", err);
      setMessage("❌ Vui lòng đăng nhập để thêm vào giỏ hàng.");
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/checkout");
  };

  if (!product)
    return <div className="text-center mt-5">Đang tải sản phẩm...</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Ảnh sản phẩm */}
        <div className="col-md-5">
          <div style={{ width: "100%", paddingTop: "100%", position: "relative" }}>
            <img
              src={
                product.img?.startsWith("http")
                  ? product.img
                  : `http://localhost:8000${product.img}`
              }
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default.png";
              }}
              className="img-fluid rounded"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="col-md-7">
          <h2>{product.name}</h2>
          <h4 className="text-danger">{product.price.toLocaleString()} VNĐ</h4>
          <p className="text-muted">Còn lại: {product.quantity} sản phẩm</p>

          {/* Chọn số lượng */}
          <div className="mb-3">
            <label htmlFor="quantityInput">Số lượng:</label>
            <input
              id="quantityInput"
              type="number"
              min="1"
              max={product.quantity}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="form-control"
              style={{ width: "120px" }}
            />
          </div>

          {/* Nút hành động */}
          <div className="d-flex gap-2">
            <button onClick={handleAddToCart} className="btn btn-outline-primary">
              🛒 Thêm vào giỏ hàng
            </button>
            <button onClick={handleBuyNow} className="btn btn-danger">
              Mua ngay
            </button>
          </div>

          {/* Thông báo */}
          {message && (
            <p
              className={`mt-3 ${
                message.startsWith("✅") ? "text-success" : "text-danger"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
