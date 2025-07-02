// src/pages/SearchPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

function SearchPage() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("q") || "";
    setKeyword(query);

    if (query) {
      axios
        .get(`http://localhost:8000/products/search?q=${encodeURIComponent(query)}`)
        .then((res) => setProducts(res.data))
        .catch((err) => console.error("Lỗi khi tìm kiếm sản phẩm:", err));
    }
  }, [location.search]);

  return (
    <div className="container mt-4">
      <h4 className="mb-4 text-center">Kết quả tìm kiếm cho: "{keyword}"</h4>
      {products.length === 0 ? (
        <p className="text-center">Không tìm thấy sản phẩm nào.</p>
      ) : (
        <div className="row">
          {products.map((p) => (
            <div className="col-6 col-sm-4 col-md-3 mb-4" key={p.id}>
              <Link to={`/product/${p.id}`} className="text-decoration-none text-dark">
                <div className="card h-100 border-0 shadow-sm">
                  <div style={{ width: "100%", paddingTop: "100%", position: "relative" }}>
                    <img
                      src={p.img}
                      alt={p.name}
                      className="card-img-top"
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
      )}
    </div>
  );
}

export default SearchPage;
