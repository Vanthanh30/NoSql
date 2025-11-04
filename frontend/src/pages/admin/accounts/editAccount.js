// src/components/admin/accounts/EditAccount.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import accountService from "../../../services/admin/accountService";

function EditAccount() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "", // để trống = không đổi
        phone: "",
        role_Id: "User",
        avatar: null
    });
    const [preview, setPreview] = useState("");
    const [error, setError] = useState("");

    // HÀM CHUẨN HÓA ROLE_ID: admin → Admin, ADMIN → Admin
    const formatRole = (role) => {
        if (!role) return "User";
        return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    };

    // LOAD DỮ LIỆU TỪ API → CHUẨN HÓA role_Id Ở ĐÂY
    useEffect(() => {
        const loadAccount = async () => {
            try {
                const res = await accountService.getAccountById(id);
                const acc = res.data.account;

                setFormData({
                    fullName: acc.fullName || "",
                    email: acc.email || "",
                    password: "", // luôn để trống
                    phone: acc.phone || "",
                    role_Id: formatRole(acc.role_Id), // CHUẨN HÓA Ở ĐÂY
                    avatar: null
                });

                setPreview(acc.avatar || "");
            } catch (err) {
                setError("Không tải được tài khoản!");
            }
        };

        if (id) loadAccount();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "avatar") {
            const file = files[0];
            setFormData({ ...formData, avatar: file });
            setPreview(URL.createObjectURL(file));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const submitData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== "") {
                submitData.append(key, value);
            }
        });

        try {
            await accountService.updateAccount(id, submitData);
            alert("Cập nhật thành công!");
            navigate("/admin/account");
        } catch (err) {
            setError(err.response?.data?.message || "Cập nhật thất bại!");
        }
    };

    return (
        <div className="edit-account">
            <div className="container">
                <div className="card">
                    <h1>Sửa tài khoản</h1>

                    <form onSubmit={handleSubmit}>
                        {/* Họ tên */}
                        <div className="form-group">
                            <label>Họ tên *</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div class="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Mật khẩu (để trống = không đổi) */}
                        <div className="form-group">
                            <label>Mật khẩu mới (để trống nếu không đổi)</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu mới"
                            />
                        </div>

                        {/* Điện thoại */}
                        <div className="form-group">
                            <label>Điện thoại</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        {/* VAI TRÒ - SELECT */}
                        <div className="form-group">
                            <label>Vai trò *</label>
                            <select
                                name="role_Id"
                                value={formData.role_Id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Chọn vai trò --</option>
                                <option value="Admin">Admin</option>
                                <option value="User">User</option>
                                <option value="Editor">Editor</option>
                            </select>
                        </div>

                        {/* Avatar */}
                        <div className="form-group">
                            <label>Ảnh đại diện</label>
                            <input
                                type="file"
                                name="avatar"
                                accept="image/*"
                                onChange={handleChange}
                            />
                            {(preview || formData.avatar) && (
                                <div className="avatar-preview">
                                    <img src={preview} alt="Avatar" />
                                </div>
                            )}
                        </div>

                        {/* Lỗi */}
                        {error && <p className="text-danger">{error}</p>}

                        {/* Nút */}
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                Cập nhật
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate("/admin/account")}
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditAccount;