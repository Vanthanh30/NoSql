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


  const [adminPage, setAdminPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const itemsPerPage = 5;

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

  const loadAllAccounts = async () => {
    try {
      setLoading(true);
      setError(null);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tài khoản Admin này?")) return;

    try {
      await accountService.deleteAccount(id);

      await loadAdminAccounts();

      const newTotal = Math.ceil((adminAccounts.length - 1) / itemsPerPage);
      if (adminPage > newTotal && adminPage > 1) {
        setAdminPage(adminPage - 1);
      }

      alert("Xóa thành công!");
    } catch (err) {
      alert(err.response?.data?.message || "Xóa thất bại!");
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/account/edit/${id}`);
  };

  const totalAdminPages = Math.ceil(adminAccounts.length / itemsPerPage);
  const startAdminIndex = (adminPage - 1) * itemsPerPage;
  const currentAdminAccounts = adminAccounts.slice(
    startAdminIndex,
    startAdminIndex + itemsPerPage
  );

  const totalUserPages = Math.ceil(userAccounts.length / itemsPerPage);
  const startUserIndex = (userPage - 1) * itemsPerPage;
  const currentUserAccounts = userAccounts.slice(
    startUserIndex,
    startUserIndex + itemsPerPage
  );
  const renderAdminTable = (accountsList, startIndex) => (
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
              Không có tài khoản Admin nào
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
                <button
                  className="btn btn-edit me-2"
                  onClick={() => handleEdit(acc._id)}
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
  );

  const renderUserTable = (accountsList, startIndex) => (
    <table className="accounts__table accounts__table--user">
      <thead>
        <tr>
          <th>STT</th>
          <th>Hình ảnh</th>
          <th>Họ và tên</th>
          <th>Email</th>
          <th>Số điện thoại</th>
          <th>Vai trò</th>
        </tr>
      </thead>
      <tbody>
        {accountsList.length === 0 ? (
          <tr>
            <td colSpan={6} className="text-center">
              Không có tài khoản User nào
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
                  : "User"}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  if (loading) return <p className="text-center">Đang tải danh sách...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <div className="accounts">
      <div className="container">
        <h1>Quản lý tài khoản</h1>
        <div className="account-section admin-section">
          <h2 className="section-title">
            Tài khoản Admin ({adminAccounts.length})
          </h2>
          <div className="table-wrapper">
            {renderAdminTable(currentAdminAccounts, startAdminIndex)}
          </div>

          {totalAdminPages > 1 && (
            <Pagination
              currentPage={adminPage}
              totalPages={totalAdminPages}
              onPageChange={setAdminPage}
            />
          )}
        </div>
        <div className="account-section user-section">
          <h2 className="section-title">
            Tài khoản User ({userAccounts.length})
          </h2>
          <div className="table-wrapper">
            {renderUserTable(currentUserAccounts, startUserIndex)}
          </div>

          {totalUserPages > 1 && (
            <Pagination
              currentPage={userPage}
              totalPages={totalUserPages}
              onPageChange={setUserPage}
            />
          )}
        </div>
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