// src/pages/admin/courses/CourseList.jsx
import React, { useEffect, useState } from "react";
import courseService from "../../../services/admin/courseService";
import "./course.scss";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../components/common/Pagination";

function CourseList() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // --- Load courses từ backend ---
    const loadCourses = async () => {
        try {
            setLoading(true);
            const res = await courseService.getAll(); // gọi đúng function trong service
            // backend trả về data dạng { courses: [...] } hoặc mảng trực tiếp
            const coursesData = res.data?.courses || res.data || [];
            setCourses(coursesData);
            setError(null);
        } catch (err) {
            console.error("Lỗi load:", err);
            setError(err.response?.data?.error || err.message || "Lỗi tải danh sách");
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    // --- Xóa mềm ---
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa khóa học này?")) return;

        try {
            await courseService.delete(id); // gọi API xóa mềm backend
            setCourses(prev => prev.filter(course => course._id !== id));

            // Cập nhật phân trang nếu cần
            const newTotal = Math.ceil((courses.length - 1) / itemsPerPage);
            if (currentPage > newTotal && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }

            alert("Khóa học đã bị xóa!");
        } catch (err) {
            console.error("Lỗi xóa:", err);
            alert("Xóa khóa học thất bại!");
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin/courses/edit/${id}`);
    };

    // --- Phân trang ---
    const totalPages = Math.ceil(courses.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentCourses = courses.slice(startIndex, startIndex + itemsPerPage);

    if (loading) return <p className="text-center">Đang tải danh sách...</p>;
    if (error) return <p className="text-danger text-center">{error}</p>;

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
                                {currentCourses.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center">
                                            Không có khóa học nào
                                        </td>
                                    </tr>
                                ) : (
                                    currentCourses.map((course, i) => (
                                        <tr key={course._id}>
                                            <td>{startIndex + i + 1}</td>
                                            <td>{course.title}</td>
                                            <td>
                                                {course.media?.imageUrl ? (
                                                    <img
                                                        src={course.media.imageUrl}
                                                        alt="Ảnh khóa học"
                                                        className="courses__image"
                                                    />
                                                ) : (
                                                    <div className="courses__image placeholder">Không có ảnh</div>
                                                )}
                                            </td>
                                            <td>{course.instructor}</td>
                                            <td>{course.time?.durationHours ?? 0}</td>
                                            <td>
                                                <span
                                                    className={`badge ${course.status === "active" ? "bg-success" : "bg-secondary"
                                                        }`}
                                                >
                                                    {course.status === "active" ? "Đang hoạt động" : "Không hoạt động"}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn courses__btn-edit"
                                                    onClick={() => handleEdit(course._id)}
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    className="btn courses__btn-delete"
                                                    onClick={() => handleDelete(course._id)}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />

                        <button
                            className="courses__btn-add"
                            onClick={() => navigate("/admin/courses/create")}
                        >
                            Thêm khóa học
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseList;
