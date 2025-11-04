// src/pages/admin/auths/index.jsx
import './login.scss';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import userService from "../../../services/admin/userService";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await userService.login(email, password);

            if (res && res.account) {
                const account = res.account;

                // 1. KIỂM TRA ROLE ADMIN
                if (account.role_Id !== "Admin") {
                    setError("Chỉ admin mới được phép đăng nhập!");
                    setLoading(false);
                    return;
                }

                // 2. LƯU VÀO localStorage DƯỚI TÊN "user" (để AdminPrivateRoute đọc được)
                localStorage.setItem("user", JSON.stringify(account));

                // 3. CHUYỂN VÀO /admin + KHÔNG QUAY LẠI ĐƯỢC
                navigate("/admin", { replace: true });
            } else {
                setError("Phản hồi không hợp lệ từ máy chủ!");
            }
        } catch (err) {
            setError(err.message || "Sai tài khoản hoặc mật khẩu!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth">
            <div className="auth__container">
                <div className="auth__header">
                    <h1 className="auth__header__title">Đăng nhập</h1>
                </div>

                <div className="auth__body">
                    <form className='auth__body__form' onSubmit={handleLogin}>
                        <div className='mb-3'>
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Nhập email của bạn"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className='mb-3'>
                            <label htmlFor="password" className="form-label">Mật khẩu</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Nhập mật khẩu của bạn"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="mb-3 text-end">
                            <button
                                type="button"
                                className="btn btn-link text-decoration-none p-0"
                                disabled={loading}
                            >
                                Quên mật khẩu
                            </button>
                        </div>

                        {error && <p style={{ color: "red", margin: "10px 0" }}>{error}</p>}

                        <button
                            type="submit"
                            className="btn auth__button"
                            disabled={loading}
                        >
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;