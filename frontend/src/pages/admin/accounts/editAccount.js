
import "./account.scss";

function EditAccount() {

    return (
        <div className="add-user">
            <div className="card">
                <h1 className="card-title"> Sửa tài khoản</h1>

                <form className="form" >
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
                        <label>Mật khẩu (bỏ trống nếu không đổi)</label>
                        <input
                            type="password"
                            name="password"
                            value=""
                            placeholder="Nhập mật khẩu mới"
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
                            <div className="slider"></div>
                        </div>
                        <span className="status-text">
                            Hoạt động
                        </span>
                    </div>

                    <div className="form-group">
                        <label>Ảnh đại diện</label>
                        <input
                            type="file"
                            accept="image/*"
                            name="avatar"

                        />

                        <div className="avatar-preview">
                            <img src="" alt="preview" />
                        </div>

                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                            Lưu thay đổi
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"

                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditAccount;
