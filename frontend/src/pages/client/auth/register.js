import React, { useState } from "react";
import "./auth.scss";
import logo from "../../../assets/images/logo.png";
import googleLogo from "../../../assets/images/google.png";
import facebookLogo from "../../../assets/images/facebook.png";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import authService from "../../../services/client/authService";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }

    setLoading(true);
    const result = await authService.registerUser(
      formData.email,
      formData.password,
      formData.confirmPassword
    );

    if (result.success) {
      alert("Tạo tài khoản thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } else {
      setError(result.error || "Lỗi khi tạo tài khoản");
    }

    setLoading(false);
  };

  return (
    <div className="auth-page register-mode">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <img src={logo} alt="Logo" />
            <h2>LEARN1</h2>
          </div>

          <h3>Tạo tài khoản</h3>
          <p>Đăng ký và khám phá các khóa học cùng chúng tôi</p>

          {error && (
            <div
              style={{
                padding: "10px",
                marginBottom: "15px",
                backgroundColor: "#ffebee",
                color: "#c62828",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                placeholder="Nhập địa chỉ e-mail"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-field password-field">
              <label>Mật khẩu</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>

            <div className="input-field password-field">
              <label>Xác nhận mật khẩu</label>
              <div className="input-wrapper">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>

            <button type="submit" className="btn-primary">
              {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </button>

            <div className="social-login">
              <button className="btn-social facebook">
                <img src={facebookLogo} alt="Facebook" />
                Đăng nhập với Facebook
              </button>
              <button className="btn-social google">
                <img src={googleLogo} alt="Google" />
                Đăng nhập với Google
              </button>
            </div>

            <div className="footer">
              Đã có tài khoản?{" "}
              <Link to="/login" className="link">
                Đăng nhập
              </Link>
            </div>

            <small>
              Việc bạn tiếp tục sử dụng trang web này đồng nghĩa với bạn đồng ý
              với <span className="link">điều khoản sử dụng</span> của chúng tôi
            </small>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
