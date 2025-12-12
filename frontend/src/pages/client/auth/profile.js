import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../../services/client/authService"; // Đảm bảo đường dẫn đúng
import "./profile.scss";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // KHỞI TẠO STATE: Lấy ngay từ LocalStorage để không bị màn hình trắng/loading
  const [user, setUser] = useState(authService.getUser());

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State form
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
      return;
    }

    // 1. Đổ dữ liệu có sẵn từ LocalStorage vào Form ngay lập tức
    const localUser = authService.getUser();
    if (localUser) {
      setUser(localUser);
      setFormData({
        // Lưu ý: Kiểm tra xem DB của bạn là 'name' hay 'fullName'.
        // Ở bài trước bạn chốt là 'fullName'.
        fullName: localUser.fullName || localUser.name || "",
        phone: localUser.phone || "",
      });
    }

    // 2. Gọi API lấy dữ liệu mới nhất (chạy ngầm)
    const fetchProfile = async () => {
      try {
        const res = await authService.getUserProfile();
        if (res.success && res.data) {
          // Cập nhật lại state với dữ liệu mới từ Server
          setUser(res.data);
          setFormData({
            fullName: res.data.fullName || res.data.name || "",
            phone: res.data.phone || "",
          });

          // Cập nhật luôn LocalStorage để lần sau vào cho nhanh
          const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
          localStorage.setItem(
            "user",
            JSON.stringify({ ...currentUser, ...res.data })
          );
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin mới:", error);
        // Không làm gì cả, vẫn hiển thị thông tin cũ từ LocalStorage
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewAvatar(URL.createObjectURL(file));
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Dùng FormData để gửi file + text
      const dataToSend = new FormData();
      // Backend đang mong đợi field là 'fullName', 'phone', 'avatar'
      dataToSend.append("fullName", formData.fullName);
      dataToSend.append("phone", formData.phone);

      if (selectedFile) {
        dataToSend.append("avatar", selectedFile);
      }

      const res = await authService.updateUserProfile(dataToSend);

      if (res.success) {
        setUser(res.data);
        setIsEditing(false);
        setSelectedFile(null);
        alert("Cập nhật thành công!");
      } else {
        alert(res.error || "Lỗi cập nhật");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra khi lưu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.logoutUser();
    navigate("/login");
  };

  // Nếu user null (trường hợp localStorage trống và API chưa trả về) mới hiện loading
  if (!user) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-header">
          <button className="back-btn" onClick={() => navigate("/")}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18L9 12L15 6" />
            </svg>
          </button>
          <h1>Thông tin cá nhân</h1>
          <div className="header-space"></div>
        </div>

        {/* Avatar Section */}
        <div className="profile-avatar-section">
          <div
            className="avatar-circle"
            onClick={() => isEditing && fileInputRef.current.click()}
            style={{ cursor: "pointer", position: "relative" }}
            title={isEditing ? "Click để đổi ảnh" : ""}
          >
            {/* Logic hiển thị ảnh: Preview > Ảnh từ server > Chữ cái đầu */}
            {previewAvatar || user.avatar ? (
              <img
                src={previewAvatar || user.avatar}
                alt="Avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            ) : (
              <span>{user.email?.charAt(0).toUpperCase() || "U"}</span>
            )}

            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                background: "#fff",
                borderRadius: "50%",
                padding: "5px",
                border: "1px solid #ddd",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept="image/*"
          />

          {/* Hiển thị Tên hoặc Email */}
          <h2>
            {formData.fullName || user.fullName || user.email?.split("@")[0]}
          </h2>
          <p className="email">{user.email}</p>
        </div>

        {/* Info Section */}
        <div className="profile-content">
          <div className="profile-card">
            <div className="card-header">
              <h3>Thông tin chi tiết</h3>
              <button
                className="edit-btn"
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                disabled={isLoading}
              >
                {isLoading ? "Đang lưu..." : isEditing ? "Lưu" : "Chỉnh sửa"}
              </button>
            </div>

            <div className="info-list">
              <div className="info-item">
                <label>Họ và tên</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName" // Quan trọng: phải khớp với formData
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Nhập họ tên"
                  />
                ) : (
                  <span>{formData.fullName || "Chưa cập nhật"}</span>
                )}
              </div>

              <div className="info-item">
                <label>Số điện thoại</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                  />
                ) : (
                  <span>{formData.phone || "Chưa cập nhật"}</span>
                )}
              </div>

              <div className="info-item">
                <label>Email</label>
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="action-btn logout-btn" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
