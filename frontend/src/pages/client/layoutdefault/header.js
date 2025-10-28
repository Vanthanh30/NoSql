import React from "react";
import { Link } from "react-router-dom"; // ✅ import Link
import "./layoutdefault.scss";
import logo from "../../../assets/images/logo.png";

const Header = () => {
    return (
        <header className="ld-header">
            <div className="ld-container">
                <div className="logo">
                    <img src={logo} alt="Learn1" />
                    <span>Learn1</span>
                </div>

                <div className="search-bar">
                    <input type="text" placeholder="Tìm kiếm..." />
                </div>

                <nav className="top-nav">
                    {/* ✅ Dùng Link thay vì <a> */}
                    <Link to="/posts">Bài viết</Link>
                    <Link to="/blog">Blog</Link>
                    <Link to="/contact">Liên hệ</Link>
                    <Link to="/login" className="btn">Đăng nhập</Link>
                    <Link to="/register" className="btn">Đăng ký</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
