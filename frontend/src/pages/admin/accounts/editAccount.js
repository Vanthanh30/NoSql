
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import accountService from "../../../services/admin/accountService";

function EditAccount() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        role_Id: "Admin",
        avatar: null
    });
    const [preview, setPreview] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAccount = async () => {
            try {
                const res = await accountService.getAccountById(id);
                const acc = res.data.account;

                setFormData({
                    fullName: acc.fullName || "",
                    email: acc.email || "",
                    password: "",
                    phone: acc.phone || "",
                    role_Id: "Admin",
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

                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

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

                        <div className="form-group">
                            <label>Điện thoại</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

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
                            {(preview || formData.avatar) && (
                                <div className="avatar-preview">
                                    <img src={preview} alt="Avatar" />
                                </div>
                            )}
                        </div>

                        {error && <p className="text-danger">{error}</p>}

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
