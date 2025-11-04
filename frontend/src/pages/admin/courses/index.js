import "./course.scss";


function Courses() {

    return (
        <div className="courses">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h1 className="courses__title">Danh sách khóa học</h1>

                        <table className="courses__table">
                            <thead>
                                <tr>
                                    <th>Số thứ tự</th>
                                    <th>Tên khóa học</th>
                                    <th>Hình ảnh</th>
                                    <th>Giảng viên</th>
                                    <th>Thời gian (giờ)</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>

                                <tr >
                                    <td>1</td>
                                    <td>lập trình</td>
                                    <td>

                                        <img
                                            src="https://i.pravatar.cc/100"
                                            alt="quản trị viên"
                                            className="courses__image"
                                        />

                                    </td>
                                    <td>giảng viên</td>
                                    <td>110</td>
                                    <td>
                                        <span
                                            className={`badge bg-success`
                                            }
                                        >
                                            đang hoạt động
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn courses__btn-edit">Sửa</button>
                                        <button className="btn courses__btn-delete">Xóa</button>
                                    </td>
                                </tr>



                            </tbody>
                        </table>

                        <button className="courses__btn-add">
                            <a href="/admin/courses/create">Thêm khóa học</a>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Courses;