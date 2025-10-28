import React from "react";
import "./layoutdefault.scss";
import logo from "../../../assets/images/logo.png"; // Logo chính
import youtubeLogo from "../../../assets/images/youtube.png"; // Logo YouTube
import instagramLogo from "../../../assets/images/instagram.png"; // Logo Instagram
import facebookLogo from "../../../assets/images/facebook.png"; // Logo Facebook

const Footer = () => {
    return (
        <footer className="ld-footer">
            <div className="ld-container footer-inner">
                <div className="footer-left">
                    <div className="footer-logo">
                        <img src={logo} alt="Learn1" />
                        <span>Learn1</span>
                    </div>
                    <div className="footer-contact">
                        <div>Điện thoại: 09 2238 1523</div>
                        <div>Email: learn1@course.edu.vn</div>
                    </div>
                </div>

                <div className="footer-middle">
                    <div className="col">
                        <h4>Sản phẩm</h4>
                        <a href="#">Các khóa học</a>
                        <a href="#">Bài viết</a>
                    </div>
                    <div className="col">
                        <h4>Chính sách & hỗ trợ</h4>
                        <a href="#">Liên hệ chúng tôi</a>
                        <a href="#">Điều khoản</a>
                    </div>
                </div>

                <div className="footer-right">
                    <h4 className="footer-title">Thông tin</h4>
                    <div className="socials">
                        <a href="#" aria-label="Facebook">
                            <img src={facebookLogo} alt="Facebook" />
                        </a>
                        <a href="#" aria-label="Instagram">
                            <img src={instagramLogo} alt="Instagram" />
                        </a>
                        <a href="#" aria-label="YouTube">
                            <img src={youtubeLogo} alt="YouTube" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;