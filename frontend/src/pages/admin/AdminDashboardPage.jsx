import React, { useEffect, useState } from 'react';
import { getOrderStats } from '../../api/order';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Card, Spinner, Row, Col, Alert } from 'react-bootstrap';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getOrderStats();

      // ⚠️ Ép kiểu tại đây: đảm bảo total_sales và canceled_sales là số
      const fixedData = {
        total_sales: Number(res.data.total_sales) || 0,
        canceled_sales: Number(res.data.canceled_sales) || 0,
      };

      setStats(fixedData);
      setError('');
    } catch (err) {
      console.error('Lỗi khi tải thống kê:', err);
      setError('Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = stats
    ? [
        { name: 'Doanh số bán', amount: stats.total_sales },
        { name: 'Đơn bị huỷ', amount: stats.canceled_sales },
      ]
    : [];

  return (
    <div>
      <h4 className="mb-4 fw-bold">📊 Thống kê tổng quan</h4>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={6}>
              <Card className="p-4 shadow-sm border-start border-success border-4">
                <h6 className="text-muted">💰 Tổng doanh thu</h6>
                <h3 className="text-success">
                  {stats.total_sales.toLocaleString()} VNĐ
                </h3>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="p-4 shadow-sm border-start border-danger border-4">
                <h6 className="text-muted">❌ Doanh thu huỷ đơn</h6>
                <h3 className="text-danger">
                  {stats.canceled_sales.toLocaleString()} VNĐ
                </h3>
              </Card>
            </Col>
          </Row>

          <h5 className="mb-3">📈 Biểu đồ doanh số</h5>
          <div className="bg-white p-3 rounded shadow-sm">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) =>
                    `${Number(value).toLocaleString()} VNĐ`
                  }
                />
                <Bar dataKey="amount" fill="#0d6efd" barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;
