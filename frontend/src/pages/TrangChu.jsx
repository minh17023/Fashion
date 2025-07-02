import React, { useEffect, useState } from "react";
import { getAllProducts } from "../api/product";
import { Link } from "react-router-dom";

function TrangChu() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Lỗi lấy sản phẩm:", err);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Danh sách sản phẩm mới</h2>
      <div className="row">
        {products.map((p) => (
          <div className="col-6 col-sm-4 col-md-3 mb-4" key={p.id}>
            <Link to={`/product/${p.id}`} className="text-decoration-none text-dark">
              <div className="card h-100 border-0 shadow-sm">
                <div style={{ width: "100%", paddingTop: "100%", position: "relative" }}>
                  <img
                    src={p.img}
                    className="card-img-top"
                    alt={p.name}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "0.5rem",
                    }}
                  />
                </div>
                <div className="card-body p-2">
                  <p className="card-title mb-1" style={{ fontSize: "14px", fontWeight: "500" }}>
                    {p.name.length > 50 ? p.name.slice(0, 50) + "..." : p.name}
                  </p>
                  <div className="text-danger fw-bold" style={{ fontSize: "15px" }}>
                    ₫{p.price.toLocaleString()}
                  </div>
                  <div className="text-muted" style={{ fontSize: "13px" }}>
                    ★★★★★ (1234)
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrangChu;
