import React, { useEffect, useState } from "react";
import {
  getCategories,
  addCategorie,
  updateCategorie,
  deleteCategorie,
} from "../../api/categories";
import { Modal, Button, Form, Table, Pagination } from "react-bootstrap";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "" });
  const perPage = 5;

  const fetchAll = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const resetState = () => {
    setForm({ name: "" });
    setEditing(null);
  };

  const handleSave = async () => {
    if (form.name.trim() === "") {
      alert("Tên danh mục không được để trống");
      return;
    }

    try {
      if (editing) {
        await updateCategorie(editing.id, form);
      } else {
        await addCategorie(form);
      }
      setShow(false);
      resetState();
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Không thể lưu danh mục");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

    try {
      await deleteCategorie(id);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.detail || "Lỗi khi xóa danh mục");
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <h4 className="mb-3">📁 Quản lý danh mục</h4>

      <div className="d-flex justify-content-between mb-3">
        <input
          className="form-control w-50"
          placeholder="Tìm danh mục..."
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
            <th>#</th>
            <th>Tên danh mục</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((c, i) => (
            <tr key={c.id}>
              <td>{(page - 1) * perPage + i + 1}</td>
              <td>{c.name}</td>
              <td>
                <Button
                  size="sm"
                  variant="warning"
                  className="me-2"
                  onClick={() => {
                    setEditing(c);
                    setForm({ name: c.name });
                    setShow(true);
                  }}
                >
                  Sửa
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(c.id)}
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
          <Modal.Title>{editing ? "Sửa" : "Thêm"} danh mục</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tên danh mục</Form.Label>
            <Form.Control
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Form.Group>
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

export default CategoriesPage;
