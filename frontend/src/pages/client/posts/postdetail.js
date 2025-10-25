import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./post.scss";

import math from "../../../assets/images/math.jpg";
import develop from "../../../assets/images/develop.jpg";
import english from "../../../assets/images/english.jpg";
import photo from "../../../assets/images/photo.jpg";
import post1 from "../../../assets/images/post1.png";
import post2 from "../../../assets/images/post2.png";
import post3 from "../../../assets/images/post3.png";
import post4 from "../../../assets/images/post4.png";

const allPosts = [
    {
        id: 1, author: "Nguyễn Hạ Ngọc", avatar: develop, title: "Trải nghiệm học thử React Native, DevOps, C++ - Vô cùng chất lượng cùng F8", desc: "Chia sẻ trải nghiệm thực tế về các khóa học tại F8, nội dung sát thực tế và hữu ích.", tag: "Front end / Mobile app", image: post1, time: "2 tiếng trước", readTime: "2 phút đọc", content: `
**F8** là địa chỉ được biết đến là cộng đồng học lập trình uy tín với hàng chục nghìn học viên...
` },
    {
        id: 2, author: "Hoàng Tuấn Tài", avatar: math, title: "Giới thiệu ngành CNTT và các kiến thức nền tảng cần học", desc: "Ngành CNTT mở ra nhiều cơ hội phát triển cho người yêu công nghệ.", tag: "Back end", image: post2, time: "3 tiếng trước", readTime: "3 phút đọc", content: `
Ngành CNTT mang đến cơ hội nghề nghiệp rộng mở và đa dạng...
` },
    {
        id: 3, author: "Văn Sơn", avatar: english, title: "Học tiếng Anh qua các chủ đề giao tiếp thông dụng 2025", desc: "Phương pháp học tiếng Anh hiệu quả và tự nhiên qua giao tiếp đời sống.", tag: "Ielts", image: post3, time: "5 tiếng trước", readTime: "4 phút đọc", content: `
Các chủ đề giao tiếp giúp bạn học tiếng Anh một cách tự nhiên nhất...
` },
    {
        id: 4, author: "Ngọc Mai", avatar: photo, title: "Hành trình trở thành nhiếp ảnh gia tự do", desc: "Chia sẻ đam mê và kinh nghiệm theo đuổi nghề nhiếp ảnh tự do.", tag: "Toeic", image: post4, time: "1 ngày trước", readTime: "5 phút đọc", content: `
Nhiếp ảnh là một hành trình của đam mê và khám phá...
` },
];

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const post = allPosts.find(p => p.id === parseInt(id));

    if (!post) {
        return <div style={{ textAlign: "center", marginTop: 50 }}>Bài viết không tồn tại.</div>;
    }

    return (
        <div className="post-detail-container">
            <button className="back-btn" onClick={() => navigate(-1)}>← Quay lại</button>

            <h1 className="post-title">{post.title}</h1>

            <div className="post-meta">
                <img src={post.avatar} alt="avatar" className="avatar" />
                <div>
                    <h4>{post.author}</h4>
                    <span>{post.time} • {post.readTime}</span>
                </div>
            </div>

            <img src={post.image} alt="post" className="post-cover" />

            <div className="post-content">
                <p>{post.content}</p>
            </div>
        </div>
    );
};

export default PostDetail;
