import React, { useState, useEffect } from "react";
import "./homepage.scss";
import { FaChevronLeft, FaChevronRight, FaUserGroup, FaPlay } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";

/* ====== IMAGES ====== */
import person from "../../../assets/images/person.png";
import english from "../../../assets/images/english.jpg";
import math from "../../../assets/images/math.jpg";
import photo from "../../../assets/images/photo.jpg";
import develop from "../../../assets/images/develop.jpg";
import post1 from "../../../assets/images/post1.png";
import post2 from "../../../assets/images/post2.png";
import post3 from "../../../assets/images/post3.png";
import post4 from "../../../assets/images/post4.png";

/* ====== MOCK DATA ====== */
const courses = [
    { id: 1, title: "Kiến Thức Nhập Môn IT", subtitle: "", price: "Miễn phí", students: "137.076", image: post1, lessons: 9, time: "3h12p" },
    { id: 2, title: "Lập Trình C++ Cơ Bản", subtitle: "", price: "Miễn phí", students: "37.400", image: post2, lessons: 10, time: "4h10p" },
    { id: 3, title: "HTML, CSS Từ Zero Đến Hero", subtitle: "", price: "Miễn phí", students: "215.400", image: post3, lessons: 18, time: "5h45p" },
    { id: 4, title: "Responsive Web Design", subtitle: "", price: "Miễn phí", students: "47.900", image: post4, lessons: 8, time: "2h50p" },
];

const posts = [
    { id: 1, title: "Tổng hợp các sản phẩm của học viên", author: "Sơn Đông", readTime: "5 phút đọc", image: english },
    { id: 2, title: "Getting Started with ES6", author: "Minh Kha", readTime: "4 phút đọc", image: math },
    { id: 3, title: "Cách đưa code lên GitHub", author: "Võ Minh Kha", readTime: "6 phút đọc", image: develop },
    { id: 4, title: "Kỹ sư ngày 25 học", author: "Sơn Đông", readTime: "3 phút đọc", image: photo },
];

const slides = [
    { title: "Thành quả sau từng khóa học", content: "Để đạt kết quả tốt cho mọi việc cần xác định mục tiêu rõ ràng cho việc đó. Học tập cũng không là ngoại lệ.", img: "/images/graduate.png" },
    { title: "Thành công từ học tập", content: "Học tập đều đặn giúp bạn tiến xa hơn trong sự nghiệp.", img: "/images/learn-together.png" },
    { title: "Cơ hội mới mỗi ngày", content: "Khám phá các khóa học để mở rộng cơ hội của bạn.", img: "/images/opportunity.png" },
];

const SectionHead = ({ title, linkText }) => (
    <div className="section-head">
        <h4>{title}</h4>
        <a className="view-more" href="#">
            {linkText}
        </a>
    </div>
);

const HomePage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setCurrentSlide((i) => (i + 1) % slides.length), 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="home-page">
            {/* ===== HERO ===== */}
            <section className="hero">
                <div className="hero-title">
                    <h3>
                        Học hỏi là chìa khóa để <span className="highlight">Mở khóa</span>
                    </h3>
                    <h3>kiến thức và cơ hội</h3>
                </div>

                <div className="hero-image-wrapper">
                    <img src={person} alt="Person" className="hero-person" />
                    {[english, photo, math, develop].map((img, i) => (
                        <div key={i} className={`hero-floating hero-${["english", "photo", "math", "develop"][i]}`}>
                            <img src={img} alt="" />
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== COURSES ===== */}
            <section className="courses">
                <SectionHead title="Khóa học miễn phí" linkText="Xem tất cả" />

                <div className="course-grid">
                    {courses.map((c) => (
                        <div className="course-card" key={c.id}>
                            <div className="thumb">
                                <img src={c.image} alt={c.title} />
                            </div>

                            <div className="course-body">
                                <h5>{c.title}</h5>
                                <p className="price">{c.price}</p>

                                <div className="course-meta">
                                    <div className="meta-item">
                                        <FaUserGroup />
                                        <span>{c.students}</span>
                                    </div>
                                    <div className="meta-item">
                                        <FaPlay />
                                        <span>{c.lessons}</span>
                                    </div>
                                    <div className="meta-item">
                                        <FaRegClock />
                                        <span>{c.time}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== POSTS ===== */}
            <section className="posts">
                <SectionHead title="Bài viết nổi bật" linkText="Xem tất cả" />

                <div className="post-list">
                    {posts.map((p) => (
                        <div className="post-card" key={p.id}>
                            <div className="post-thumb">
                                <img src={p.image} alt={p.title} />
                            </div>
                            <div className="post-body">
                                <h6>{p.title}</h6>
                                <p className="p-meta">
                                    {p.author} • {p.readTime}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;