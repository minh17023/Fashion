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
  const [previewImg, setPreviewImg] = useState(null);
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
    setPreviewImg(null);
    setEditing(null);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.quantity || !form.categorie_id) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("quantity", form.quantity);
    formData.append("categorie_id", form.categorie_id);
    if (imgFile) {
      formData.append("img", imgFile);
    }

    try {
      if (editing) {
        await updateProduct(editing.id, formData);
      } else {
        await addProduct(formData);
      }
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
      <h4 className="mb-3">📦 Quản lý sản phẩm</h4>

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
          ➕ Thêm
        </Button>
      </div>

      <Table bordered hover>
        <thead className="table-light">
          <tr>
            <th>STT</th>
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
                {p.img && (
                  <img
                    src={`http://localhost:8000${p.img}`}
                    alt={p.name}
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                  />
                )}
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
                    setPreviewImg(`http://localhost:8000${p.img}`);
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
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                />
              </Form.Group>
            ))}
            <Form.Group className="mb-2">
              <Form.Label>Danh mục</Form.Label>
              <Form.Select
                value={form.categorie_id}
                onChange={(e) => setForm({ ...form, categorie_id: e.target.value })}
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
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImgFile(file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setPreviewImg(reader.result);
                    reader.readAsDataURL(file);
                  } else {
                    setPreviewImg(null);
                  }
                }}
              />
              {previewImg && (
                <img
                  src={previewImg}
                  alt="Preview"
                  style={{ width: 100, height: 100, objectFit: "cover", marginTop: 10 }}
                />
              )}
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
