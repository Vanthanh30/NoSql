import React, { useEffect, useState } from "react";
import Dashboard from "../../../components/Dashboard";
import courseAPI from "../../../services/admin/courseService";
import "./dashboard.scss";

const AdminDashboardPage = () => {
    const [courses, setCourses] = useState([]);
    const [refreshFlag, setRefreshFlag] = useState(false); // state để refresh dữ liệu

    // Hàm gọi để trigger refresh khi thêm khóa học/bài viết
    const triggerRefresh = () => setRefreshFlag(prev => !prev);

    // Load danh sách khóa học
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await courseAPI.getAll();
                setCourses(res.data || []);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách khóa học:", error);
            }
        };

        fetchCourses();
    }, [refreshFlag]); // reload mỗi khi refreshFlag thay đổi

    return (
        <div>
            <h1>Trang tổng quan</h1>

            {/* Component Dashboard nhận prop refreshFlag */}
            <Dashboard refreshFlag={refreshFlag} />

            {/* Bảng danh sách khóa học */}
            <div className="dashboard-list">
                <h2>Danh sách khóa học</h2>
                <table className="table-course">
                    <thead>
                        <tr>
                            <th>Tiêu đề</th>
                            <th>Giá</th>
                            <th>Giảm giá</th>
                            <th>Giáo viên</th>
                            <th>Ngày tạo</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length > 0 ? (
                            courses.slice(0, 3).map((course) => (
                                <tr key={course._id}>
                                    <td>{course.title}</td>
                                    <td>{course.pricing?.price?.toLocaleString()}₫</td>
                                    <td>{course.pricing?.discount || 0}%</td>
                                    <td>{course.instructor}</td>
                                    <td>
                                        {new Date(course.createdAt).toLocaleDateString("vi-VN")}
                                    </td>
                                    <td>{course.status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center" }}>
                                    Không có khóa học nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div style={{ textAlign: "center", marginTop: "10px" }}>
                    <button
                        className="btn-view-more"
                        onClick={() => window.location.href = "/admin/courses"}
                    >
                        Xem thêm
                    </button>
                </div>
            </div>

            {/* Ví dụ: truyền triggerRefresh xuống component thêm khóa học / bài viết */}
            {/* <CreateCourse onCreateSuccess={triggerRefresh} /> */}
            {/* <CreateArticle onCreateSuccess={triggerRefresh} /> */}
        </div>
    );
};

export default AdminDashboardPage;