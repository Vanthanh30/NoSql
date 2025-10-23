import React from "react";
import "./layoutdefault.scss";
import logo from "../../../assets/images/logo.png";

const Header = () => {
    return (
        <header className="ld-header">
            <div className="ld-container">
                <div className="logo">
                    <img src={logo} alt="Learn 1" />
                    <span>Learn 1</span>
                </div>
                <div className="search-bar">
                    <input type="text" placeholder="Tìm kiếm..." />
                </div>
                <nav className="top-nav">
                    <a href="#">Bài viết</a>
                    <a href="#">Blog</a>
                    <a href="#">Liên hệ</a>
                    <a href="#" className="btn">Đăng nhập</a>
                    <a href="#" className="btn">Đăng ký</a>
                </nav>
            </div>
        </header>
    );
};

export default Header;