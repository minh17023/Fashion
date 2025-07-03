import React from "react";
import { Carousel } from "react-bootstrap";

const Banner = () => {
  return (
    <div className="container mb-4">
      <div className="row g-2">
        {/* Cột trái: Carousel */}
        <div className="col-md-8">
          <Carousel interval={3000} controls={true} indicators={true}>
            {["banner1.jpg", "banner2.jpg", "banner3.jpg"].map((img, index) => (
              <Carousel.Item key={index}>
                <img
                  src={`/banners/${img}`}
                  className="d-block w-100"
                  alt={`Banner ${index + 1}`}
                  style={{ height: "250px", objectFit: "cover", borderRadius: "10px" }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        {/* Cột phải: 2 ảnh dọc */}
        <div className="col-md-4 d-flex flex-column justify-content-between">
          {["right1.jpg", "right2.jpg"].map((img, index) => (
            <img
              key={index}
              src={`/banners/${img}`}
              alt={`Right Banner ${index + 1}`}
              style={{
                width: "100%",
                height: "120px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
