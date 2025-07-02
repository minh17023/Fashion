import React from "react";
import { Link } from "react-router-dom";

function ThankYouPage() {
  return (
    <div className="container text-center mt-5">
      <h2>🎉 Cảm ơn bạn đã đặt hàng!</h2>
      <p>Đơn hàng của bạn đang được xử lý.</p>
      <Link className="btn btn-success mt-3" to="/">Tiếp tục mua sắm</Link>
    </div>
  );
}

export default ThankYouPage;
