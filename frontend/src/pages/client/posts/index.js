import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./post.scss";

import post1 from "../../../assets/images/post1.png";
import post2 from "../../../assets/images/post2.png";
import post3 from "../../../assets/images/post3.png";
import post4 from "../../../assets/images/post4.png";

import math from "../../../assets/images/math.jpg";
import develop from "../../../assets/images/develop.jpg";
import english from "../../../assets/images/english.jpg";
import photo from "../../../assets/images/photo.jpg";

const Posts = () => {
    const [selectedTag, setSelectedTag] = useState("Tất cả");
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 4;

    const categories = [
        "Tất cả",
        "Back end",
        "Front end",
        "Front end / Mobile app",
        "Ielts",
        "English Peaking",
        "Toeic",
    ];

    const allPosts = [
        { id: 1, author: "Nguyễn Hạ Ngọc", avatar: develop, title: "Trải nghiệm học thử React Native, DevOps, C++ - Vô cùng chất lượng cùng F8", desc: "Chia sẻ trải nghiệm thực tế về các khóa học tại F8, nội dung sát thực tế và hữu ích.", tag: "Front end / Mobile app", image: post1, time: "2 tiếng trước", readTime: "2 phút đọc" },
        { id: 2, author: "Hoàng Tuấn Tài", avatar: math, title: "Giới thiệu ngành CNTT và các kiến thức nền tảng cần học", desc: "Ngành CNTT mở ra nhiều cơ hội phát triển cho người yêu công nghệ.", tag: "Back end", image: post2, time: "3 tiếng trước", readTime: "3 phút đọc" },
        { id: 3, author: "Văn Sơn", avatar: english, title: "Học tiếng Anh qua các chủ đề giao tiếp thông dụng 2025", desc: "Phương pháp học tiếng Anh hiệu quả và tự nhiên qua giao tiếp đời sống.", tag: "Ielts", image: post3, time: "5 tiếng trước", readTime: "4 phút đọc" },
        { id: 4, author: "Ngọc Mai", avatar: photo, title: "Hành trình trở thành nhiếp ảnh gia tự do", desc: "Chia sẻ đam mê và kinh nghiệm theo đuổi nghề nhiếp ảnh tự do.", tag: "Toeic", image: post4, time: "1 ngày trước", readTime: "5 phút đọc" },
        { id: 5, author: "Hồng Quân", avatar: develop, title: "Làm thế nào để trở thành lập trình viên Front-end chuyên nghiệp?", desc: "Từ người mới bắt đầu đến lập trình viên chuyên nghiệp cần những kỹ năng gì?", tag: "Front end", image: post1, time: "2 ngày trước", readTime: "4 phút đọc" },
        { id: 6, author: "Trần Hiếu", avatar: english, title: "Cách luyện nghe TOEIC hiệu quả trong 30 ngày", desc: "Chiến lược luyện TOEIC phần nghe giúp bạn tăng điểm nhanh chóng.", tag: "Toeic", image: post3, time: "3 ngày trước", readTime: "3 phút đọc" },
        { id: 7, author: "Tuấn Kiệt", avatar: math, title: "Cấu trúc dữ liệu và giải thuật — nền tảng vững chắc cho Dev", desc: "Một phần quan trọng giúp lập trình viên nâng cao tư duy logic và giải quyết vấn đề.", tag: "Back end", image: post2, time: "4 ngày trước", readTime: "6 phút đọc" },
        { id: 8, author: "Phương Linh", avatar: photo, title: "Cách chỉnh màu ảnh chuyên nghiệp bằng Lightroom", desc: "Những mẹo chỉnh màu giúp ảnh của bạn trở nên nghệ thuật và chuyên nghiệp.", tag: "Photography", image: post4, time: "5 ngày trước", readTime: "4 phút đọc" },
    ];
    const navigate = useNavigate();


    const filteredPosts =
        selectedTag === "Tất cả"
            ? allPosts
            : allPosts.filter((p) => p.tag === selectedTag);

    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);


    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirst, indexOfLast);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="posts-container">
            {/* Bộ lọc chủ đề */}
            <div className="topic-filter">
                <h3>XEM CÁC BÀI VIẾT THEO CHỦ ĐỀ</h3>
                <div className="topic-buttons">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`topic-btn ${selectedTag === cat ? "active" : ""}`}
                            onClick={() => {
                                setSelectedTag(cat);
                                setCurrentPage(1);
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Danh sách bài viết */}
            <div className="featured-posts">
                <h3>BÀI VIẾT NỔI BẬT</h3>
                <p>Tổng hợp các bài viết chia sẻ hữu ích, cập nhật liên tục.</p>

                <div className="post-list">
                    {currentPosts.map((post) => (
                        <div
                            key={post.id}
                            className="post-item"
                            onClick={() => navigate(`/post/${post.id}`)}
                        >
                            <div className="post-image">
                                <img src={post.image} alt="post" />
                            </div>

                            <div className="post-info">
                                <div className="post-header">
                                    <img src={post.avatar} alt="avatar" className="avatar" />
                                    <div>
                                        <h4 className="author">{post.author}</h4>
                                        <span className="time">{post.time}</span>
                                    </div>
                                </div>

                                <h2 className="post-title">{post.title}</h2>
                                <p className="post-desc">{post.desc}</p>

                                <div className="post-footer">
                                    <span className="tag">{post.tag}</span>
                                    <span className="read-time">{post.readTime}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Phân trang */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        className={`page-btn ${currentPage === page ? "active" : ""}`}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Posts;
