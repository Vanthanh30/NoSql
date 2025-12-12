import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./layoutdefault.scss";
import logo from "../../../assets/images/logo.png";
import { FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import SearchBar from "../../../components/common/Search";

const Header = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");

      let userData = null;
      try {
        if (userString) {
          userData = JSON.parse(userString);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }

      const loggedIn = !!token && token !== "null" && token !== "undefined";

      setIsLoggedIn(loggedIn);
      setUser(userData);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    navigate("/profile");
  };

  const getInitials = () => {
    if (user?.fullName) {
      return user.fullName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <header className="ld-header">
      <div className="ld-container">
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" />
          <span>Learn1</span>
        </Link>

        <SearchBar />

        {!isLoggedIn ? (
          <nav className="top-nav">
            <Link to="/posts">Bài viết</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/contact">Liên hệ</Link>
            <Link to="/login" className="btn btn-outline">
              Đăng nhập
            </Link>
            <Link to="/register" className="btn btn-primary">
              Đăng ký
            </Link>
          </nav>
        ) : (
          <nav className="top-nav logged-in">
            <div className="menu-links">
              <Link to="/posts" className="nav-link">
                Bài viết
              </Link>
              <Link to="/blog" className="nav-link">
                Blog
              </Link>
              <Link to="/contact" className="nav-link">
                Liên hệ
              </Link>
            </div>

            <div className="user-actions">
              <div className="avatar-wrapper" ref={dropdownRef}>
                <div
                  className={`avatar ${showDropdown ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowDropdown(!showDropdown);
                  }}
                  title="Tài khoản"
                  style={{ cursor: "pointer" }}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" />
                  ) : (
                    <span className="avatar-letter">{getInitials()}</span>
                  )}
                </div>

                {showDropdown && (
                  <div
                    className="dropdown-menu"
                    style={{
                      display: "block",
                      position: "absolute",
                      top: "calc(100% + 12px)",
                      right: 0,
                      backgroundColor: "white",
                      zIndex: 9999,
                      minWidth: "280px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      borderRadius: "12px",
                    }}
                  >
                    <div className="dropdown-header">
                      <div className="user-avatar">
                        {user?.avatar ? (
                          <img src={user.avatar} alt="Avatar" />
                        ) : (
                          <span className="avatar-letter">{getInitials()}</span>
                        )}
                      </div>
                      <div className="user-info">
                        <p className="user-name">
                          {user?.fullName
                            ? user.fullName
                            : user?.email || "Người dùng"}
                        </p>
                        {user?.fullName && (
                          <p className="user-email">{user?.email || ""}</p>
                        )}
                      </div>
                    </div>

                    <div className="dropdown-divider"></div>

                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={handleProfileClick}
                    >
                      <FiUser size={18} />
                      <span>Thông tin cá nhân</span>
                    </Link>

                    <Link
                      to="/settings"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FiSettings size={18} />
                      <span>Cài đặt</span>
                    </Link>

                    <div className="dropdown-divider"></div>

                    <button
                      className="dropdown-item logout"
                      onClick={handleLogout}
                    >
                      <FiLogOut size={18} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
