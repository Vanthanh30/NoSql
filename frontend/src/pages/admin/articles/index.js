import "./article.scss"
function ArticlesPage() {
    return (
        <div className="articles">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h1 className="articles__title">Danh sách bài viết</h1>

                        <table className="articles__table">
                            <thead>
                                <tr>
                                    <th>Số thứ tự</th>
                                    <th>Tên bài viết</th>
                                    <th>Danh mục</th>
                                    <th>người tạo</th>
                                    <th>Ngày đăng</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr >
                                    <td>1</td>
                                    <td>lập trình trực quan</td>
                                    <td>lập trình</td>
                                    <td>Nguyễn Văn A</td>
                                    <td>01/01/2023</td>
                                    <td>
                                        <span
                                            className="badge bg-success"
                                        >
                                            Hoạt động
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn categories__btn-edit"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className="btn categories__btn-delete"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>

                            </tbody>
                        </table>

                        <button className="articles__btn-add">
                            <a href="/admin/articles/create">Thêm bài viết</a>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ArticlesPage;