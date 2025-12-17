import React, { useEffect, useState } from "react";
import accountService from "../../../services/admin/accountService";
import "./account.scss";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../components/common/Pagination";

function AccountList() {
    const navigate = useNavigate();
    const [adminAccounts, setAdminAccounts] = useState([]);
    const [userAccounts, setUserAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Phân trang riêng cho Admin và User
    const [adminPage, setAdminPage] = useState(1);
    const [userPage, setUserPage] = useState(1);
    const itemsPerPage = 5;

    // ========================================
    // LOAD ADMIN ACCOUNTS
    // ========================================
    const loadAdminAccounts = async () => {
        try {
            const data = await accountService.getAdminAccounts();
            console.log("Loaded admin accounts:", data);
            setAdminAccounts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Lỗi load admin accounts:", err);
            setAdminAccounts([]);
        }
    };

    // ========================================
    // LOAD USER ACCOUNTS
    // ========================================
    const loadUserAccounts = async () => {
        try {
            const data = await accountService.getUserAccounts();
            console.log("Loaded user accounts:", data);
            setUserAccounts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Lỗi load user accounts:", err);
            setUserAccounts([]);
        }
    };

    // ========================================
    // LOAD TẤT CẢ (gọi song song)
    // ========================================
    const loadAllAccounts = async () => {
        try {
            setLoading(true);
            setError(null);

            // Gọi song song 2 hàm load
            await Promise.all([
                loadAdminAccounts(),
                loadUserAccounts()
            ]);
        } catch (err) {
            console.error("Lỗi load:", err);
            setError(err.message || "Lỗi tải danh sách");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllAccounts();
    }, []);

    // ========================================
    // XỬ LÝ XÓA
    // ========================================
    const handleDelete = async (id, isAdmin) => {
        if (!window.confirm("Bạn có chắc muốn xóa tài khoản này?")) return;

        try {
            await accountService.deleteAccount(id);

            // Reload lại danh sách tương ứng
            if (isAdmin) {
                await loadAdminAccounts();
                // Tự động về trang trước nếu trang hiện tại trống
                const newTotal = Math.ceil((adminAccounts.length - 1) / itemsPerPage);
                if (adminPage > newTotal && adminPage > 1) {
                    setAdminPage(adminPage - 1);
                }
            } else {
                await loadUserAccounts();
                // Tự động về trang trước nếu trang hiện tại trống
                const newTotal = Math.ceil((userAccounts.length - 1) / itemsPerPage);
                if (userPage > newTotal && userPage > 1) {
                    setUserPage(userPage - 1);
                }
            }

            alert("Xóa thành công!");
        } catch (err) {
            alert(err.response?.data?.message || "Xóa thất bại!");
        }
    };

    // ========================================
    // XỬ LÝ SỬA (chỉ cho Admin)
    // ========================================
    const handleEdit = (id) => {
        navigate(`/admin/account/edit/${id}`);
    };

    // ========================================
    // PHÂN TRANG CHO ADMIN
    // ========================================
    const totalAdminPages = Math.ceil(adminAccounts.length / itemsPerPage);
    const startAdminIndex = (adminPage - 1) * itemsPerPage;
    const currentAdminAccounts = adminAccounts.slice(
        startAdminIndex,
        startAdminIndex + itemsPerPage
    );

    // ========================================
    // PHÂN TRANG CHO USER
    // ========================================
    const totalUserPages = Math.ceil(userAccounts.length / itemsPerPage);
    const startUserIndex = (userPage - 1) * itemsPerPage;
    const currentUserAccounts = userAccounts.slice(
        startUserIndex,
        startUserIndex + itemsPerPage
    );

    // ========================================
    // COMPONENT HIỂN THỊ BẢNG
    // ========================================
    const renderTable = (accountsList, startIndex, isAdmin = false) => (
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
                {accountsList.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="text-center">
                            Không có tài khoản nào
                        </td>
                    </tr>
                ) : (
                    accountsList.map((acc, i) => (
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
                                    ? acc.role_Id.charAt(0).toUpperCase() +
                                    acc.role_Id.slice(1).toLowerCase()
                                    : "-"}
                            </td>
                            <td>
                                {/* ADMIN: có cả Sửa và Xóa */}
                                {isAdmin && (
                                    <button
                                        className="btn btn-edit me-2"
                                        onClick={() => handleEdit(acc._id)}
                                    >
                                        Sửa
                                    </button>
                                )}

                                {/* CẢ ADMIN VÀ USER: đều có nút Xóa */}
                                <button
                                    className="btn btn-delete"
                                    onClick={() => handleDelete(acc._id, isAdmin)}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );

    // ========================================
    // LOADING & ERROR STATES
    // ========================================
    if (loading) return <p className="text-center">Đang tải danh sách...</p>;
    if (error) return <p className="text-danger text-center">{error}</p>;

    // ========================================
    // RENDER MAIN UI
    // ========================================
    return (
        <div className="accounts">
            <div className="container">
                <h1>Quản lý tài khoản</h1>

                {/* ========================================
                    PHẦN ADMIN
                ======================================== */}
                <div className="account-section admin-section">
                    <h2 className="section-title">
                        Tài khoản Admin ({adminAccounts.length})
                    </h2>
                    <div className="table-wrapper">
                        {renderTable(currentAdminAccounts, startAdminIndex, true)}
                    </div>

                    {totalAdminPages > 1 && (
                        <Pagination
                            currentPage={adminPage}
                            totalPages={totalAdminPages}
                            onPageChange={setAdminPage}
                        />
                    )}
                </div>

                {/* ========================================
                    PHẦN USER
                ======================================== */}
                <div className="account-section user-section">
                    <h2 className="section-title">
                        Tài khoản User ({userAccounts.length})
                    </h2>
                    <div className="table-wrapper">
                        {renderTable(currentUserAccounts, startUserIndex, false)}
                    </div>

                    {totalUserPages > 1 && (
                        <Pagination
                            currentPage={userPage}
                            totalPages={totalUserPages}
                            onPageChange={setUserPage}
                        />
                    )}
                </div>

                {/* ========================================
                    NÚT THÊM
                ======================================== */}
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