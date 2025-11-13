import React from "react";
import { Link } from "react-router-dom";
import "./layoutdefault.scss";
import logo from "../../../assets/images/logo.png";

// Icon (dùng react-icons cho nhanh, bạn có thể thay bằng SVG)
import { FiShoppingCart, FiBell, FiGlobe } from "react-icons/fi";

const Header = () => {
    // Kiểm tra đã đăng nhập chưa
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user"); // có thể là JSON string
    const isLoggedIn = !!token || !!user;

    return (
        <header className="ld-header">
            <div className="ld-container">
                {/* Logo */}
                <div className="logo">
                    <img src={logo} alt="dune" />
                    <span>Learn1</span>
                </div>

                {/* Thanh tìm kiếm - luôn hiển thị */}
                <div className="search-bar">
                    <input type="text" placeholder="Search" />
                </div>

                {/* Phần menu - thay đổi theo trạng thái đăng nhập */}
                {isLoggedIn ? (
                    // ĐÃ ĐĂNG NHẬP → giống hệt ảnh bạn gửi
                    <nav className="top-nav logged-in">
                        <div className="menu-links">
                            <Link to="/courses" className="has-dropdown">
                                Courses <span className="arrow-down">↓</span>
                            </Link>
                            <Link to="/my-course">My course</Link>
                            <Link to="/blog">Blog</Link>
                            <Link to="/contact">Contact</Link>
                        </div>

                        <div className="user-icons">
                            <Link to="/cart" className="icon">
                                <FiShoppingCart size={22} />
                            </Link>
                            <Link to="/notifications" className="icon">
                                <FiBell size={22} />
                            </Link>
                            <button className="icon">
                                <FiGlobe size={22} />
                            </button>
                            <Link to="/profile" className="avatar">
                                <div className="avatar-circle">
                                    {user ? (
                                        <img
                                            src={JSON.parse(user)?.avatar || "https://via.placeholder.com/40"}
                                            alt="User"
                                        />
                                    ) : (
                                        <span>U</span>
                                    )}
                                </div>
                            </Link>
                        </div>
                    </nav>
                ) : (
                    // CHƯA ĐĂNG NHẬP → giữ nguyên như cũ
                    <nav className="top-nav">
                        <Link to="/posts">Bài viết</Link>
                        <Link to="/blog">Blog</Link>
                        <Link to="/contact">Liên hệ</Link>
                        <Link to="/login" className="btn">Đăng nhập</Link>
                        <Link to="/register" className="btn">Đăng ký</Link>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;