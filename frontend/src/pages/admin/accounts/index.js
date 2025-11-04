import './account.scss'
function AdminAccountsPage() {
    return (
        <div className="accounts">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h1 className="accounts__title">Danh sách tài khoản</h1>

                        <table className="accounts__table">
                            <thead>
                                <tr>
                                    <th>Số thứ tự</th>
                                    <th>Hình ảnh</th>
                                    <th>Tên tài khoản</th>
                                    <th>Email</th>
                                    <th>Vai trò</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>

                                <tr>
                                    <td>1</td>
                                    <td>
                                        <img
                                            src="https://i.pravatar.cc/100"
                                            alt="Avatar"
                                            className="accounts__image"
                                        />
                                    </td>
                                    <td>Văn thanh</td>
                                    <td>vanthanh@example.com</td>
                                    <td>Admin</td>
                                    <td>
                                        <span
                                            className="badge bg-success"
                                        >
                                            Hoạt động
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn accounts__btn-edit" >Sửa</button>
                                        <button className="btn accounts__btn-delete" >Xóa</button>
                                    </td>
                                </tr>

                            </tbody>
                        </table>

                        <button className="accounts__btn-add">
                            <a href="/admin/account/create">Thêm tài khoản</a>
                        </button>

                    </div>
                </div>
            </div>
        </div >
    );
}

export default AdminAccountsPage;