import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./userprofile.scss";
import userService from "../../../services/client/userService";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiShield,
  FiEdit2,
  FiCamera,
} from "react-icons/fi";

const UserProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError("");

    const result = await userService.getUserProfile();

    if (result.success) {
      setUser(result.data);
    } else {
      setError(result.error || "Không thể tải thông tin người dùng");
      if (result.error === "Unauthorized") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    }

    setLoading(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { text: "Đang hoạt động", class: "active" },
      inactive: { text: "Không hoạt động", class: "inactive" },
      banned: { text: "Đã bị khóa", class: "banned" },
    };
    return statusMap[status] || { text: status, class: "default" };
  };

  const getInitials = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  if (loading) {
    return (
      <div className="user-profile-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Có lỗi xảy ra</h2>
          <p>{error}</p>
          <button onClick={fetchUserProfile} className="btn-retry">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Thông tin tài khoản</h1>
          <button className="btn-edit" onClick={() => setEditMode(!editMode)}>
            <FiEdit2 size={18} />
            {editMode ? "Hủy" : "Chỉnh sửa"}
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="avatar-section">
              <div className="avatar-wrapper">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" />
                ) : (
                  <div className="avatar-placeholder">
                    <span>{getInitials()}</span>
                  </div>
                )}
                <button className="change-avatar-btn" title="Đổi ảnh đại diện">
                  <FiCamera size={18} />
                </button>
              </div>
              <h2 className="user-name">{user?.name || "Người dùng"}</h2>
              <p className="user-email">{user?.email}</p>
              <div
                className={`status-badge ${getStatusBadge(user?.status).class}`}
              >
                {getStatusBadge(user?.status).text}
              </div>
            </div>

            <div className="quick-stats">
              <div className="stat-item">
                <span className="stat-label">Ngày tham gia</span>
                <span className="stat-value">
                  {formatDate(user?.createdAt)}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Cập nhật lần cuối</span>
                <span className="stat-value">
                  {formatDate(user?.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-main">
            <div className="info-section">
              <h3>Thông tin cá nhân</h3>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">
                    <FiUser size={18} />
                    <span>Họ và tên</span>
                  </div>
                  {editMode ? (
                    <input
                      type="text"
                      defaultValue={user?.name || ""}
                      className="info-input"
                    />
                  ) : (
                    <div className="info-value">
                      {user?.name || "Chưa cập nhật"}
                    </div>
                  )}
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <FiMail size={18} />
                    <span>Email</span>
                  </div>
                  <div className="info-value">{user?.email}</div>
                  <span className="info-note">Email không thể thay đổi</span>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <FiShield size={18} />
                    <span>Trạng thái tài khoản</span>
                  </div>
                  <div className="info-value">
                    <div
                      className={`status-badge ${
                        getStatusBadge(user?.status).class
                      }`}
                    >
                      {getStatusBadge(user?.status).text}
                    </div>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <FiCalendar size={18} />
                    <span>Ngày tạo tài khoản</span>
                  </div>
                  <div className="info-value">
                    {formatDate(user?.createdAt)}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <FiCalendar size={18} />
                    <span>Cập nhật lần cuối</span>
                  </div>
                  <div className="info-value">
                    {formatDate(user?.updatedAt)}
                  </div>
                </div>
              </div>

              {editMode && (
                <div className="form-actions">
                  <button className="btn-save">Lưu thay đổi</button>
                  <button
                    className="btn-cancel"
                    onClick={() => setEditMode(false)}
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>

            <div className="security-section">
              <h3>Bảo mật</h3>
              <div className="security-item">
                <div className="security-info">
                  <h4>Đổi mật khẩu</h4>
                  <p>Cập nhật mật khẩu để bảo vệ tài khoản</p>
                </div>
                <button className="btn-secondary">Đổi mật khẩu</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
