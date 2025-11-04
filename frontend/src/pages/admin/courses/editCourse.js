
import './course.scss';
import TextEditor from '../../../components/TinyMCE/index';



function EditCourse() {

    return (
        <div className="add-course">
            <div className="add-course__header">
                <h1>Chỉnh sửa khóa học</h1>
                <div className="add-course__header-actions">
                    <button type="button" className="btn btn-secondary" >Làm mới</button>
                    <button form="add-course-form" className="btn btn-primary">Lưu khóa học</button>
                </div>
            </div>

            <form id="add-course-form" className="add-course__form" >
                {/* Left column */}
                <div className="add-course__left">
                    <div className="form-group">
                        <label htmlFor="title">Tên khóa học</label>
                        <input id="title" className="form-control" value="" />
                    </div>

                    <div className="grid-3">
                        <div className="form-group">
                            <label>Danh mục</label>
                            <select
                                className="form-control"
                                value="chọn danh mục"
                            >
                                <option disabled>Chưa có danh mục</option>
                                <option value="category1">Danh mục 1</option>
                                <option value="category2">Danh mục 2</option>
                                <option value="category3">Danh mục 3</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Trình độ</label>
                            <select className="form-control" value="chọn trình độ">
                                <option value="basic">Cơ bản</option>
                                <option value="intermediate">Trung cấp</option>
                                <option value="advanced">Nâng cao</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Ngôn ngữ</label>
                            <select className="form-control" value="chọn ngôn ngữ">
                                <option value="vietnamese">Tiếng Việt</option>
                                <option value="english">Tiếng Anh</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Mô tả chi tiết</label>
                        <TextEditor />
                    </div>

                    <div className="panel">
                        <div className="panel__title"> Nội dung khóa học</div>
                        <div className="modules">

                            <div className="module">
                                <div className="module__header">
                                    <input
                                        className="form-control"
                                        value="Chương 1"

                                        placeholder="Tên chương"
                                    />
                                    <div className="module__actions">
                                        <button type="button" className="btn btn-light">+ Bài học</button>
                                        <button type="button" className="btn btn-danger" >Xóa chương</button>
                                    </div>
                                </div>

                                <div className="lessons">

                                    <div className="lesson">
                                        <input
                                            className="form-control"
                                            value="bài học 1"
                                            placeholder="Tên bài học"
                                        />
                                        <button type="button" className="btn btn-ghost" >✕</button>
                                    </div>

                                    <div className="muted">Chưa có bài học</div>
                                </div>
                            </div>

                            <button type="button" className="btn btn-outline">+ Thêm chương</button>
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className="add-course__right">
                    <div className="form-group">
                        <label>Giảng viên</label>
                        <input className="form-control" value="Giảng viên 1" />
                    </div>

                    <div className="form-group">
                        <label>Trạng thái</label>
                        <select className="form-control" value="Sắp khai giảng">
                            <option>Sắp khai giảng</option>
                            <option>Đang diễn ra</option>
                            <option>Hoàn thành</option>
                            <option>Đã hủy</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Ngày bắt đầu</label>
                        <input type="date" className="form-control" value="2023-01-01" />
                    </div>

                    <div className="form-group">
                        <label>Ngày kết thúc</label>
                        <input type="date" className="form-control" value="2023-12-31" />
                    </div>

                    <div className="form-group">
                        <label>Thời lượng (giờ)</label>
                        <input type="number" min="0" className="form-control" value="0" />
                    </div>

                    <div className="panel">
                        <div className="panel__title"> Ảnh đại diện</div>
                        <input type="file" accept="image/*" className="form-control" />
                        <img className="preview-image" src="https://via.placeholder.com/150" alt="preview" />
                    </div>

                    <div className="panel">
                        <div className="panel__title">🎬 Video giới thiệu</div>
                        <input type="file" accept="video/*" className="form-control" />
                        <video className="preview-video" src="#" controls />
                    </div>

                    <div className="panel">
                        <div className="panel__title">💰 Học phí</div>
                        <div className="grid-2">
                            <div className="form-group">
                                <label>Giá gốc (VNĐ)</label>
                                <input type="number" min="0" className="form-control" value="1233" />
                            </div>
                            <div className="form-group">
                                <label>Giảm giá (%)</label>
                                <input type="number" min="0" max="100" className="form-control" value="0" />
                            </div>
                        </div>
                        <div className="final-price">
                            Giá sau giảm: <strong>1222 VNĐ</strong>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
export default EditCourse;