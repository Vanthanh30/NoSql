import './layoutDefaultAdmin.scss';
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <p>Theo dõi chúng tôi trên mạng xã hội:</p>
                <div className="social-links">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FaFacebookF className="icon" /> Facebook
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <FaTwitter className="icon" /> Twitter
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <FaInstagram className="icon" /> Instagram
                    </a>
                </div>
                <p className="copyright">© {new Date().getFullYear()} Your Company. All rights reserved.</p>
            </div>
        </footer>
    );
}
export default Footer;