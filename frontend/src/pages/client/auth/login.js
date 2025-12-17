import React, { useState } from "react";
import "./auth.scss";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import googleLogo from "../../../assets/images/google.png";
import facebookLogo from "../../../assets/images/facebook.png";
import authService from "../../../services/client/authService";

const Login = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Vui lòng nhập email!");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!password) {
      setError("Vui lòng nhập mật khẩu!");
      return;
    }

    setLoading(true);
    setError("");

    const result = await authService.loginUser(email, password);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Đăng nhập thất bại");
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <img src={logo} alt="Logo" />
            <h2>LEARN1</h2>
          </div>

          <h3>Chào mừng trở lại</h3>
          <p>Chào mừng trở lại! Vui lòng nhập thông tin của bạn</p>

          {error && (
            <div
              style={{
                padding: "10px",
                marginBottom: "15px",
                backgroundColor: "#ffebee",
                color: "#c62828",
                borderRadius: "8px",
                fontSize: "14px",
                border: "1px solid #ef5350",
              }}
            >
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleNext}
              >
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  autoFocus
                />

                <div className="auth-options">
                  <span className="link">Dùng số điện thoại</span>
                  <Link to="/forgot-password" className="link">
                    Quên mật khẩu?
                  </Link>
                </div>

                <button type="submit" className="btn-primary">
                  Tiếp tục
                </button>

                <div className="social-login">
                  <button type="button" className="btn-social facebook">
                    <img src={facebookLogo} alt="Facebook" />
                    Đăng nhập với Facebook
                  </button>
                  <button type="button" className="btn-social google">
                    <img src={googleLogo} alt="Google" />
                    Đăng nhập với Google
                  </button>
                </div>

                <p className="footer">
                  Chưa có tài khoản?{" "}
                  <Link to="/register" className="link">
                    Đăng ký
                  </Link>
                </p>
                <small>
                  Việc bạn tiếp tục sử dụng trang web này đồng nghĩa với bạn
                  đồng ý với <span className="link">điều khoản sử dụng</span>{" "}
                  của chúng tôi
                </small>
              </motion.form>
            ) : (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleLogin}
              >
                <label>Mật khẩu</label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu của bạn"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  autoFocus
                  disabled={loading}
                />

                <div className="auth-options">
                  <span
                    className="link"
                    onClick={handleBack}
                    style={{ cursor: "pointer" }}
                  >
                    ← Quay lại
                  </span>
                  <Link to="/forgot-password" className="link">
                    Quên mật khẩu?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>

                <p className="footer">
                  Chưa có tài khoản?{" "}
                  <Link to="/register" className="link">
                    Đăng ký
                  </Link>
                </p>
                <small>
                  Việc bạn tiếp tục sử dụng trang web này đồng nghĩa với bạn
                  đồng ý với <span className="link">điều khoản sử dụng</span>{" "}
                  của chúng tôi
                </small>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Login;
