import "./categories.scss"


function CategoriesPage() {


    return (
        <div className="categories">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h1 className="categories__title">Danh sách khóa học</h1>

                        <table className="categories__table">
                            <thead>
                                <tr>
                                    <th>Số thứ tự</th>
                                    <th>Tên danh mục</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>

                                <tr >
                                    <td>1</td>
                                    <td>lập trình</td>
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

                        <button className="categories__btn-add">
                            <a href="/admin/categories/create">Thêm danh mục</a>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoriesPage;