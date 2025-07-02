import React from "react";

function Footer() {
  return (
    <footer className="bg-light border-top mt-5">
      <div className="container text-start py-4">
        <div className="row gy-3">
          {/* Cột 1 */}
          <div className="col-md-3">
            <h6 className="fw-bold mb-2">FASHION SHOP</h6>
            <p className="mb-2 small">
              Thương hiệu thời trang mang đến phong cách hiện đại.<br />
              Tự hào là thương hiệu thời trang Việt Nam với trải nghiệm tốt nhất.
            </p>
            {/* <img
              src="/bo-cong-thuong.png"
              alt="Đã thông báo BCT"
              style={{ width: "100px" }}
            /> */}
          </div>

          {/* Cột 2 */}
          <div className="col-md-3">
            <h6 className="fw-bold mb-2 border-bottom pb-1">HỖ TRỢ KHÁCH HÀNG</h6>
            <ul className="list-unstyled small">
              <li>Giới thiệu</li>
              <li>Liên hệ</li>
              <li>Góp ý</li>
              <li>Hướng dẫn mua hàng</li>
              <li>Tuyển dụng</li>
            </ul>
          </div>

          {/* Cột 3 */}
          <div className="col-md-3">
            <h6 className="fw-bold mb-2 border-bottom pb-1">DỊCH VỤ KHÁCH HÀNG</h6>
            <ul className="list-unstyled small">
              <li>Chính sách hội viên</li>
              <li>Chính sách vận chuyển</li>
              <li>Quy định đổi trả</li>
              <li>Chính sách bảo mật</li>
            </ul>
          </div>

          {/* Cột 4 */}
          <div className="col-md-3">
            <h6 className="fw-bold mb-2 border-bottom pb-1">KẾT NỐI KHÁCH HÀNG</h6>
            <ul className="list-unstyled small">
              <li>Facebook</li>
              <li>Instagram</li>
              <li>Tiktok</li>
              <li>Zalo</li>
            </ul>
          </div>
        </div>

        <hr className="my-3" />
        <p className="text-center text-muted small mb-0">
          &copy; {new Date().getFullYear()} © FASHION SHOP
        </p>
      </div>
    </footer>
  );
}

export default Footer;
