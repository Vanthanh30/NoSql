

import "./account.scss";

function AddUser() {

    return (
        <div className="add-user">
            <div className="card">
                <h1 className="card-title"> Thêm tài khoản</h1>

                <form className="form">
                    <div className="form-group">
                        <label>Họ tên</label>
                        <input
                            type="text"
                            name="fullName"
                            value=""
                            placeholder="Nhập họ tên"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value=""
                            placeholder="Nhập email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            value=""
                            placeholder="Nhập mật khẩu"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input
                            type="text"
                            name="phone"
                            value=""
                            placeholder="Nhập số điện thoại"
                        />
                    </div>

                    <div className="form-group">
                        <label>Vai trò</label>
                        <select
                            name="role_id"
                            value=""
                        >
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                            <option value="editor">Editor</option>
                        </select>
                    </div>
                    <div className="form-group toggle-status">
                        <label>Trạng thái</label>
                        <div
                            className="active-toggle"
                        >
                            <div className="slider">

                            </div>
                        </div>
                        <span className="status-text">
                            Hoạt động
                        </span>
                    </div>

                    <div className="form-group">
                        <label>Ảnh đại diện</label>
                        <input type="file" accept="image/*" />
                        <div className="avatar-preview">
                            <img src="" alt="preview" />
                        </div>

                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" >
                            Thêm tài khoản
                        </button>
                        <button type="button" className="btn btn-secondary">
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddUser;