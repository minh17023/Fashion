import React, { useEffect, useState } from "react";
import { getAllProducts } from "../api/product";
import { getCategories } from "../api/categories";
import { Link } from "react-router-dom";

function TrangChu() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
      }
    }

    fetchData();
  }, []);

  const latestProducts = [...products]
    .sort((a, b) => b.id - a.id) // giả sử sản phẩm mới có id lớn hơn
    .slice(0, 8);

  const filteredProducts = selectedCategoryId
    ? products.filter((p) => p.categorie_id === selectedCategoryId)
    : [];

  return (
    <div className="container mt-4">
      {/* 🆕 SẢN PHẨM MỚI NHẤT */}
      <h4 className="mb-4 fw-bold text-center">🆕 Sản phẩm mới nhất</h4>
      <div className="row mb-5">
        {latestProducts.map((p) => (
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

      {/* 🗂 DANH MỤC */}
      <h4 className="fw-bold mb-3">📂 Danh mục</h4>
      <div className="row row-cols-2 row-cols-sm-4 row-cols-md-6 row-cols-lg-8 g-3 mb-5">
        <div className="col text-center">
          <div
            onClick={() => setSelectedCategoryId(null)}
            style={{
              cursor: "pointer",
              padding: 10,
              borderRadius: "50%",
              backgroundColor: "#f1f1f1",
              width: 70,
              height: 70,
              margin: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span className="fw-bold">All</span>
          </div>
          <div style={{ fontSize: "14px", marginTop: 5 }}>Tất cả</div>
        </div>

        {categories.map((c) => (
          <div className="col text-center" key={c.id}>
            <div
              onClick={() => setSelectedCategoryId(c.id)}
              style={{
                cursor: "pointer",
                padding: 10,
                borderRadius: "50%",
                backgroundColor: "#f1f1f1",
                width: 70,
                height: 70,
                margin: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border:
                  selectedCategoryId === c.id
                    ? "2px solid #007bff"
                    : "1px solid transparent",
              }}
            >
              <img
                src={c.img}
                alt={c.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "50%",
                }}
              />
            </div>
            <div style={{ fontSize: "14px", marginTop: 5 }}>{c.name}</div>
          </div>
        ))}
      </div>

      {/* 🛍 SẢN PHẨM THEO DANH MỤC */}
      {selectedCategoryId && (
        <>
          <h4 className="mb-3 fw-bold text-center">
            🛍 Sản phẩm thuộc danh mục "
            {categories.find((c) => c.id === selectedCategoryId)?.name}"
          </h4>
          <div className="row">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <div className="col-6 col-sm-4 col-md-3 mb-4" key={p.id}>
                  <Link to={`/product/${p.id}`} className="text-decoration-none text-dark">
                    <div className="card h-100 border-0 shadow-sm">
                      <div
                        style={{ width: "100%", paddingTop: "100%", position: "relative" }}
                      >
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
                        <p
                          className="card-title mb-1"
                          style={{ fontSize: "14px", fontWeight: "500" }}
                        >
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
              ))
            ) : (
              <div className="text-center text-muted">Không có sản phẩm nào</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default TrangChu;
