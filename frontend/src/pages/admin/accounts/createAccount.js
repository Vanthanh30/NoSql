// src/components/admin/accounts/AddAccount.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import accountService from "../../../services/admin/accountService";

function AddAccount() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        role_Id: "Admin", // ← KHÓA CỨNG: Luôn là Admin
        avatar: null
    });
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");

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
            await accountService.createAccount(submitData);
            alert("Thêm tài khoản thành công!");
            navigate("/admin/account");
        } catch (err) {
            setError(err.response?.data?.message || "Thêm thất bại!");
        }
    };

    return (
        <div className="add-account">
            <div className="container">
                <div className="card">
                    <h1>Thêm tài khoản</h1>

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
                                placeholder="Nhập họ tên"
                            />
                        </div>

                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Nhập email"
                            />
                        </div>

                        <div className="form-group">
                            <label>Mật khẩu *</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Nhập mật khẩu"
                            />
                        </div>

                        <div className="form-group">
                            <label>Điện thoại</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Nhập số điện thoại"
                            />
                        </div>

                        {/* VAI TRÒ - HIỂN THỊ CỐ ĐỊNH */}
                        <div className="form-group">
                            <label>Vai trò *</label>
                            <input
                                type="text"
                                value="Admin"
                                disabled
                                className="form-control"
                                style={{
                                    backgroundColor: '#e9ecef',
                                    cursor: 'not-allowed',
                                    color: '#495057'
                                }}
                            />
                        </div>

                        <div className="form-group">
                            <label>Ảnh đại diện</label>
                            <input
                                type="file"
                                name="avatar"
                                accept="image/*"
                                onChange={handleChange}
                            />
                            {preview && (
                                <div className="avatar-preview">
                                    <img src={preview} alt="Preview" />
                                </div>
                            )}
                        </div>

                        {error && <p className="text-danger">{error}</p>}

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                Lưu
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

export default AddAccount;
