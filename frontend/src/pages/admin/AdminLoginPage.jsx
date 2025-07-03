import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../api/auth';
import { jwtDecode } from 'jwt-decode'; // ✅ Đúng cú pháp

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginAdmin(username, password);

      if (res.access_token) {
        const decoded = jwtDecode(res.access_token); // ✅ Dùng đúng tên hàm

        if (decoded.role === 'admin') {
          // Lưu token và chuyển hướng
          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('admin_logged_in', 'true');
          navigate('/admin/dashboard');
        } else {
          setError('Bạn không có quyền truy cập.');
        }
      } else {
        setError('Đăng nhập không hợp lệ.');
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      setError('Tên đăng nhập hoặc mật khẩu không đúng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow" style={{ width: '400px' }}>
        <div className="card-body">
          <h2 className="text-center mb-4">Đăng nhập quản trị</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Tên đăng nhập</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Mật khẩu</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
