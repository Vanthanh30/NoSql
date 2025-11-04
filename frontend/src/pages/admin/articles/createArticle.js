import "./article.scss"
import TextEditor from '../../../components/TinyMCE/index';
function CreateArticles() {
    return (
        <div className="create-article">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h1 className="article__title">Tạo bài viết mới</h1>
                        <form className="article__form">
                            <div className="form-group">
                                <label htmlFor="title">Tiêu đề bài viết</label>
                                <input type="text" id="title" name="title" placeholder="Nhập tiêu đề bài viết" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="category">Danh mục</label>
                                <select id="category" name="category">
                                    <option value="">Chọn danh mục</option>
                                    <option value="programming">Lập trình</option>
                                    <option value="design">Thiết kế</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Ảnh(nếu có)</label>
                                <input type="file" accept="image/*" />
                                <div className="avatar-preview">
                                    <img src="https://via.placeholder.com/150" alt="preview" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Chi tiết bài viết</label>
                                <TextEditor value="" />
                            </div>
                            <button type="submit" className="btn-submit">Lưu bài viết</button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateArticles;  