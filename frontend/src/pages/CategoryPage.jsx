import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function CategoryPage() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/products/category/${id}`);
        setProducts(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm:", err);
      }
    };

    fetchProducts();
  }, [id]);

  return (
    <div className="container mt-4">
      <h4 className="mb-4 text-center">Danh mục sản phẩm #{id}</h4>
      <div className="row">
        {products.map((item) => (
          <div className="col-6 col-sm-4 col-md-3 mb-4" key={item.id}>
            <Link to={`/product/${item.id}`} className="text-decoration-none text-dark">
              <div className="card h-100 border-0 shadow-sm">
                <div style={{ width: "100%", paddingTop: "100%", position: "relative" }}>
                  <img
                    src={
                      item.img?.startsWith("http")
                        ? item.img
                        : `http://localhost:8000${item.img}`
                    }
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default.png";
                    }}
                    alt={item.name}
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
                  <div className="badge bg-warning text-dark mb-1">CHOICE</div>
                  <p className="card-title mb-1" style={{ fontSize: "14px", fontWeight: "500" }}>
                    {item.name.length > 50 ? item.name.slice(0, 50) + "..." : item.name}
                  </p>
                  <div className="text-danger fw-bold" style={{ fontSize: "15px" }}>
                    ₫{item.price.toLocaleString()}
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

export default CategoryPage;
