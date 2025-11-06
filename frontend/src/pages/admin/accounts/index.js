import React, { useEffect, useState } from "react";
import accountService from "../../../services/admin/accountService";
import "./account.scss";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../components/common/Pagination";

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

    // XỬ LÝ XÓA
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa tài khoản này?")) return;

        try {
            await accountService.deleteAccount(id);
            await loadAccounts();
            alert("Xóa thành công!");

            // Tự động về trang trước nếu trang hiện tại trống
            const newTotal = Math.ceil((accounts.length - 1) / itemsPerPage);
            if (currentPage > newTotal && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        } catch (err) {
            alert(err.response?.data?.message || "Xóa thất bại!");
        }
    };

    // XỬ LÝ SỬA (mới thêm)
    const handleEdit = (id) => {
        navigate(`/admin/account/edit/${id}`);
    };

    // PHÂN TRANG
    const totalPages = Math.ceil(accounts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentAccounts = accounts.slice(startIndex, startIndex + itemsPerPage);

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
                                            {/* DÙNG handleEdit */}
                                            <button
                                                className="btn btn-edit me-2"
                                                onClick={() => handleEdit(acc._id)}
                                            >
                                                Sửa
                                            </button>

                                            {/* DÙNG handleDelete */}
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
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />

                {/* NÚT THÊM */}
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