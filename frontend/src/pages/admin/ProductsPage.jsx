// src/pages/admin/ProductsPage.jsx
import React, { useEffect, useState } from "react";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../api/product";
import { getCategories } from "../../api/categories";
import { Modal, Button, Form, Table, Pagination } from "react-bootstrap";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    categorie_id: "",
  });
  const [imgFile, setImgFile] = useState(null);
  const perPage = 5;

  const fetchAll = async () => {
    setProducts(await getAllProducts());
    setCategories(await getCategories());
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const resetState = () => {
    setForm({ name: "", price: "", quantity: "", categorie_id: "" });
    setImgFile(null);
    setEditing(null);
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  
  const handleSave = async () => {
    try {
      let imgBase64 = editing?.img || "";
      if (imgFile) {
        imgBase64 = await readFileAsBase64(imgFile); // 👍 đảm bảo ảnh đã sẵn sàng
      }
  
      const payload = { ...form, img: imgBase64 };
      await submitData(payload);
    } catch (err) {
      console.error("Không thể xử lý ảnh:", err);
      alert("Lỗi xử lý ảnh");
    }
  };

  const submitData = async (payload) => {
    try {
      editing
        ? await updateProduct(editing.id, payload)
        : await addProduct(payload);
      setShow(false);
      resetState();
      fetchAll();
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
      alert("Không thể lưu sản phẩm");
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <input
          className="form-control w-50"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          onClick={() => {
            resetState();
            setShow(true);
          }}
        >
          + Thêm
        </Button>
      </div>

      <Table bordered hover>
        <thead className="table-light">
          <tr>
            <th>Id</th>
            <th>Tên</th>
            <th>Giá</th>
            <th>SL</th>
            <th>Danh mục</th>
            <th>Ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((p, i) => (
            <tr key={p.id}>
              <td>{(page - 1) * perPage + i + 1}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.quantity}</td>
              <td>{categories.find((c) => c.id === p.categorie_id)?.name || p.categorie_id}</td>
              <td>
              <img src={p.img} alt={p.name} style={{ width: 50, height: 50 }} />
              </td>
              <td>
                <Button
                  size="sm"
                  variant="warning"
                  className="me-2"
                  onClick={() => {
                    setEditing(p);
                    setForm({
                      name: p.name,
                      price: p.price,
                      quantity: p.quantity,
                      categorie_id: p.categorie_id,
                    });
                    setShow(true);
                  }}
                >
                  Sửa
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() =>
                    window.confirm("Xóa?") && deleteProduct(p.id).then(fetchAll)
                  }
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        {[...Array(Math.ceil(filtered.length / perPage))].map((_, i) => (
          <Pagination.Item
            key={i}
            active={page === i + 1}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "Sửa" : "Thêm"} sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {["name", "price", "quantity"].map((field) => (
              <Form.Group className="mb-2" key={field}>
                <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                <Form.Control
                  type={field === "name" ? "text" : "number"}
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                />
              </Form.Group>
            ))}
            <Form.Group className="mb-2">
              <Form.Label>Danh mục</Form.Label>
              <Form.Select
                value={form.categorie_id}
                onChange={(e) =>
                  setForm({ ...form, categorie_id: e.target.value })
                }
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Ảnh</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImgFile(e.target.files[0])}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductsPage;
