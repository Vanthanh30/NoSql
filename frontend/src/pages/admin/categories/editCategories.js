import './categories.scss';
import TextEditor from '../../../components/TinyMCE/index';

function EditCategories() {

    return (
        <div className="categories-page">
            <h1>Chỉnh sửa danh mục</h1>
            <form>
                <div className="form-group">
                    <label>Tên danh mục</label>
                    <input
                        type="text"
                        placeholder="Nhập tên danh mục"
                        value=""
                        required
                    />

                    <label>Danh mục cha</label>
                    <select
                        value="Không chọn"
                    >
                        <option value="">-- Không chọn --</option>
                        <option value="1">Lập trình</option>
                        <option value="2">Thiết kế</option>
                    </select>

                </div>

                <div className='form-group'>
                    <label>Trạng thái</label>
                    <select
                        value="active"
                    >
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Ngừng hoạt động</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Mô tả</label>
                    <TextEditor value="" />

                </div>

                <button type="submit" className="btn-submit">Lưu</button>
            </form>
        </div>
    );
}

export default EditCategories;