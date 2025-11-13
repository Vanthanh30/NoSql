import React, { useEffect, useState } from "react";
import { FaBook, FaChalkboardTeacher, FaNewspaper, FaDollarSign } from "react-icons/fa";
import courseAPI from "../../services/admin/courseService";
import articleAPI from "../../services/admin/articleService";
import "../../pages/admin/dashboard/dashboard.scss";

const Dashboard = ({ refreshFlag }) => {
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalTeachers: 0,
        totalArticles: 0,
        totalRevenue: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesRes, articlesRes] = await Promise.all([
                    courseAPI.getAll(),
                    articleAPI.getAll(),
                ]);

                const courses = coursesRes.data || [];
                const articles = articlesRes.data || [];

                const totalCourses = courses.length;
                const totalArticles = articles.length;
                const totalTeachers = new Set(
                    courses.map((c) => c.instructor || c.teacher || c.teacherId)
                ).size;

                // Tính doanh thu thực tế có giảm giá
                const totalRevenue = courses.reduce((sum, c) => {
                    const price = c.pricing?.price || 0;
                    const discount = c.pricing?.discount || 0;
                    return sum + price * (100 - discount) / 100;
                }, 0);

                setStats({ totalCourses, totalArticles, totalTeachers, totalRevenue });
            } catch (error) {
                console.error("Lỗi lấy dữ liệu Dashboard:", error);
            }
        };

        fetchData();
    }, [refreshFlag]); // reload khi refreshFlag thay đổi

    return (
        <div className="dashboard">
            <div className="dashboard-item orange">
                <FaBook className="dashboard-icon" />
                <h2>Tổng khóa học</h2>
                <div className="quantity">{stats.totalCourses}</div>
            </div>

            <div className="dashboard-item blue">
                <FaChalkboardTeacher className="dashboard-icon" />
                <h2>Tổng giáo viên</h2>
                <div className="quantity">{stats.totalTeachers}</div>
            </div>

            <div className="dashboard-item green">
                <FaNewspaper className="dashboard-icon" />
                <h2>Tổng bài viết</h2>
                <div className="quantity">{stats.totalArticles}</div>
            </div>

            <div className="dashboard-item yellow">
                <FaDollarSign className="dashboard-icon" />
                <h2>Tổng doanh thu</h2>
                <div className="quantity">{stats.totalRevenue.toLocaleString()}₫</div>
            </div>
        </div>
    );
};

export default Dashboard;
