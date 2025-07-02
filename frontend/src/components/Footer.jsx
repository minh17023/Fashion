import React from "react";

function Footer() {
  return (
    <footer className="bg-light text-center p-3 mt-5">
      <p>&copy; {new Date().getFullYear()} Nhà thuốc trực tuyến. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
