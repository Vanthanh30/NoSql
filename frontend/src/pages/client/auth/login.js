import React, { useState } from "react";
import "./auth.scss";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import googleLogo from "../../../assets/images/google.png";
import facebookLogo from "../../../assets/images/facebook.png";

const Login = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const handleNext = (e) => {
        e.preventDefault();
        if (!email) return alert("Vui lòng nhập email!");
        setStep(2);
    };

    const handleBack = () => setStep(1);

    const handleLogin = (e) => {
        e.preventDefault();
        if (!password || !confirm) return alert("Vui lòng nhập mật khẩu!");
        if (password !== confirm) return alert("Mật khẩu không khớp!");
        alert(`Đăng nhập thành công với email: ${email}`);
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
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <div className="auth-options">
                                    <span className="link">Dùng số điện thoại</span>
                                    <Link to="/forgot-password" className="link">Quên mật khẩu?</Link>
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
                                    Chưa có tài khoản? <span className="link">Đăng ký</span>
                                </p>
                                <small>
                                    Việc bạn tiếp tục sử dụng trang web này đồng nghĩa với bạn đồng
                                    ý với <span className="link">điều khoản sử dụng</span> của chúng tôi
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
                                    placeholder="Mật khẩu"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <label>Xác nhận mật khẩu</label>
                                <input
                                    type="password"
                                    placeholder="Xác nhận mật khẩu"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                />

                                <div className="auth-options">
                                    <span className="link" onClick={handleBack}>
                                        ← Quay lại
                                    </span>
                                    <Link to="/forgot-password" className="link">Quên mật khẩu?</Link>
                                </div>

                                <button type="submit" className="btn-primary">
                                    Tiếp tục
                                </button>

                                <p className="footer">
                                    Chưa có tài khoản? <span className="link">Đăng ký</span>
                                </p>
                                <small>
                                    Việc bạn tiếp tục sử dụng trang web này đồng nghĩa với bạn đồng
                                    ý với <span className="link">điều khoản sử dụng</span> của chúng tôi
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
