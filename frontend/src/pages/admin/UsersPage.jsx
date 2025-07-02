import React, { useEffect, useState } from "react";
import { getAllUsers, updateUser, deleteUser } from "../../api/user";
import { Table, Pagination, Form, Button } from "react-bootstrap";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 5;

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Lỗi khi tải người dùng:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (user, newRole) => {
    try {
      await updateUser(user.id, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert("Lỗi khi cập nhật quyền");
    }
  };

  const handleActiveToggle = async (user) => {
    try {
      await updateUser(user.id, { is_active: !user.is_active });
      fetchUsers();
    } catch (err) {
      alert("Lỗi khi cập nhật trạng thái hoạt động");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      alert("Không thể xóa người dùng.");
    }
  };

  const filtered = users.filter((u) =>
    u.username?.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <h4 className="mb-3">👥 Quản lý người dùng</h4>

      <Form.Control
        className="w-50 mb-3"
        placeholder="Tìm theo tên đăng nhập..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Table bordered hover>
        <thead className="table-light">
          <tr>
            <th>Id</th>
            <th>Tên đăng nhập</th>
            <th>Email</th>
            <th>Phân quyền</th>
            <th>Hoạt động</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((u, i) => (
            <tr key={u.id}>
              <td>{(page - 1) * perPage + i + 1}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>
                <Form.Select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u, e.target.value)}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </Form.Select>
              </td>
              <td className="text-center">
                <Form.Check
                  type="switch"
                  id={`active-${u.id}`}
                  checked={u.is_active}
                  onChange={() => handleActiveToggle(u)}
                  label={u.is_active ? "Bật" : "Tắt"}
                />
              </td>
              <td>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(u.id)}
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
    </div>
  );
};

export default UsersPage;
