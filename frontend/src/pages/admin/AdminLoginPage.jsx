import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, getCurrentUser } from '../../api/auth';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Bước 1: Gửi yêu cầu login
      const res = await loginUser(username, password);

      if (res.access_token) {
        // Bước 2: Lưu token
        localStorage.setItem('access_token', res.access_token);

        // Bước 3: Gọi /auth/me để kiểm tra quyền
        const user = await getCurrentUser(res.access_token);

        if (user.role === 'admin') {
          localStorage.setItem('admin_logged_in', 'true');
          navigate('/admin/dashboard');
        } else {
          setError('Bạn không có quyền truy cập.');
        }
      } else {
        setError('Đăng nhập không hợp lệ.');
      }
    } catch (err) {
      setError('Tên đăng nhập hoặc mật khẩu không đúng.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow" style={{ width: '400px' }}>
        <div className="card-body">
          <h2 className="text-center mb-4">Đăng nhập</h2>
          <form onSubmit={handleLogin}>
            {error && <div className="alert alert-danger">{error}</div>}

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

            <button type="submit" className="btn btn-primary w-100">Đăng nhập</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
