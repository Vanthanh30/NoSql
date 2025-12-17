import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./auth.scss";
import logo from "../../../assets/images/logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Yêu cầu khôi phục mật khẩu gửi đến:", email);
  };

  return (
    <div className="auth-page forgot-mode">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <img src={logo} alt="Learn 1 Logo" />
            <h2>LEARN 1</h2>
          </div>

          <h3>Quên mật khẩu</h3>
          <p>Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.</p>

          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" className="btn-primary">
              Gửi liên kết khôi phục
            </button>

            <div className="footer">
              <Link to="/login" className="link">
                ← Quay lại đăng nhập
              </Link>
            </div>

            <small>
              Việc tiếp tục đồng nghĩa bạn đồng ý với{" "}
              <a href="/terms" className="link">
                điều khoản sử dụng
              </a>{" "}
              của chúng tôi.
            </small>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
