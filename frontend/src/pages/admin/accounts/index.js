// src/components/admin/accounts/AccountList.jsx
import React, { useEffect, useState } from "react";
import accountService from "../../../services/admin/accountService";
import "./account.scss";
import { useNavigate } from "react-router-dom";

function AccountList() {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const loadAccounts = async () => {
        try {
            setLoading(true);
            const data = await accountService.getAccounts();
            setAccounts(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            console.error("Lỗi load:", err);
            setError(err.message || "Lỗi tải danh sách");
            setAccounts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAccounts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa tài khoản này?")) return;

        try {
            await accountService.deleteAccount(id);
            await loadAccounts();
            alert("Xóa thành công!");
            const newTotal = Math.ceil((accounts.length - 1) / itemsPerPage);
            if (currentPage > newTotal && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        } catch (err) {
            alert(err.response?.data?.message || "Xóa thất bại!");
        }
    };

    // PHÂN TRANG
    const totalPages = Math.ceil(accounts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentAccounts = accounts.slice(startIndex, startIndex + itemsPerPage);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (loading) return <p className="text-center">Đang tải danh sách...</p>;
    if (error) return <p className="text-danger text-center">{error}</p>;

    return (
        <div className="accounts">
            <div className="container">
                <h1>Danh sách tài khoản</h1>

                <div className="table-wrapper">
                    <table className="accounts__table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Hình ảnh</th>
                                <th>Họ và tên</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Vai trò</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentAccounts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center">
                                        Không có tài khoản nào
                                    </td>
                                </tr>
                            ) : (
                                currentAccounts.map((acc, i) => (
                                    <tr key={acc._id}>
                                        <td>{startIndex + i + 1}</td>
                                        <td>
                                            {acc.avatar ? (
                                                <img
                                                    src={acc.avatar}
                                                    alt="avatar"
                                                    className="accounts__image"
                                                />
                                            ) : (
                                                <div className="accounts__image placeholder" />
                                            )}
                                        </td>
                                        <td>{acc.fullName}</td>
                                        <td>{acc.email}</td>
                                        <td>{acc.phone || "-"}</td>
                                        <td>
                                            {acc.role_Id
                                                ? acc.role_Id.charAt(0).toUpperCase() + acc.role_Id.slice(1).toLowerCase()
                                                : "-"}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-edit me-2"
                                                onClick={() => navigate(`/admin/account/edit/${acc._id}`)}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                className="btn btn-delete"
                                                onClick={() => handleDelete(acc._id)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PHÂN TRANG */}
                {totalPages > 1 && (
                    <div className="pagination-wrapper">
                        <button
                            className="pagination-btn"
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Trước
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
                                onClick={() => goToPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            className="pagination-btn"
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Sau
                        </button>
                    </div>
                )}

                {/* NÚT THÊM - TỰ CÁCH THEO BẢNG */}
                <div className="add-button-wrapper">
                    <button
                        className="btn-add-account"
                        onClick={() => navigate("/admin/account/create")}
                    >
                        Thêm tài khoản
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AccountList;