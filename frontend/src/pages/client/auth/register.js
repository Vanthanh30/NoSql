import React, { useState } from "react";
import "./auth.scss";
import logo from "../../../assets/images/logo.png";
import googleLogo from "../../../assets/images/google.png";
import facebookLogo from "../../../assets/images/facebook.png";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <div className="auth-page register-mode">
            <div className="auth-wrapper">
                <div className="auth-card">
                    <div className="auth-header">
                        <img src={logo} alt="Logo" />
                        <h2>LEARN 1</h2>
                    </div>

                    <h3>Tạo tài khoản</h3>
                    <p>Đăng ký và khám phá các khóa học cùng chúng tôi</p>

                    <form>
                        <div className="input-field">
                            <label>E-mail</label>
                            <input type="email" placeholder="Nhập địa chỉ e-mail" />
                        </div>

                        <div className="input-field password-field">
                            <label>Mật khẩu</label>
                            <div className="input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Nhập mật khẩu"
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
                                    placeholder="Nhập lại mật khẩu"
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
                            Tạo tài khoản
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
