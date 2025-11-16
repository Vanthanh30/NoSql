import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./homepage.scss";
import {
  FaChevronLeft,
  FaChevronRight,
  FaUserGroup,
  FaPlay,
} from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
import courseService from "../../../services/client/courseService";
import articleService from "../../../services/client/articleService";

/* ====== IMAGES ====== */
import person from "../../../assets/images/person.png";
import english from "../../../assets/images/english.jpg";
import math from "../../../assets/images/math.jpg";
import photo from "../../../assets/images/photo.jpg";
import develop from "../../../assets/images/develop.jpg";

const slides = [
  {
    title: "Thành quả sau từng khóa học",
    content:
      "Để đạt kết quả tốt cho mọi việc cần xác định mục tiêu rõ ràng cho việc đó. Học tập cũng không là ngoại lệ.",
    img: "/images/graduate.png",
  },
  {
    title: "Thành công từ học tập",
    content: "Học tập đều đặn giúp bạn tiến xa hơn trong sự nghiệp.",
    img: "/images/learn-together.png",
  },
  {
    title: "Cơ hội mới mỗi ngày",
    content: "Khám phá các khóa học để mở rộng cơ hội của bạn.",
    img: "/images/opportunity.png",
  },
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
  const [courses, setCourses] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await courseService.getAllCourses();
        setCourses(data);
      } catch (error) {
        console.error(" Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchArticles = async () => {
      try {
        setLoadingArticles(true);
        const data = await articleService.getAllArticles();
        setArticles(data);
      } catch (error) {
        console.error(" Error loading articles:", error);
      } finally {
        setLoadingArticles(false);
      }
    };

    fetchArticles();
    fetchCourses();
  }, []);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentSlide((i) => (i + 1) % slides.length),
      5000
    );
    return () => clearInterval(interval);
  }, []);

  const getFinalPrice = (pricing) => {
    if (!pricing || !pricing.price) return 0;
    const { price, discount } = pricing;
    if (!discount) return price;
    return price - (price * discount) / 100;
  };

  const formatPrice = (pricing) => {
    const finalPrice = getFinalPrice(pricing);
    if (finalPrice === 0) return "Miễn phí";
    return `${finalPrice.toLocaleString("vi-VN")} đ`;
  };

  const getTotalLessons = (chapters) => {
    if (!chapters || !Array.isArray(chapters)) return 0;
    return chapters.reduce(
      (total, chapter) => total + (chapter.lessons?.length || 0),
      0
    );
  };

  const formatDuration = (hours) => {
    if (!hours) return "0h";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h${m}p` : `${h}h`;
  };

  const getStudentCount = () => {
    return Math.floor(Math.random() * 100000).toLocaleString("vi-VN");
  };

  const getAuthorDisplay = (article) => {
    const authorName =
      article.createdBy?.account_id?.fullName || "Tác giả ẩn danh";
    const readTime = `${Math.floor(Math.random() * 5) + 2} phút đọc`;
    return `${authorName} • ${readTime}`;
  };

  return (
    <div className="home-page">
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
            <div
              key={i}
              className={`hero-floating hero-${
                ["english", "photo", "math", "develop"][i]
              }`}
            >
              <img src={img} alt="" />
            </div>
          ))}
        </div>
      </section>

      <section className="courses">
        <SectionHead title="Khóa học" linkText="Xem tất cả" />

        {loading ? (
          <div className="loading">Đang tải khóa học...</div>
        ) : courses.length === 0 ? (
          <div className="no-courses">Chưa có khóa học nào</div>
        ) : (
          <div className="course-grid">
            {courses.slice(0, 4).map((course) => (
              <div
                className="course-card"
                key={course._id}
                onClick={() => navigate(`/course/${course._id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="thumb">
                  <img
                    src={course.media?.imageUrl}
                    alt={course.title}
                    onError={(e) =>
                      (e.target.src = "/images/course-placeholder.png")
                    }
                  />
                </div>

                <div className="course-body">
                  <h5>{course.title}</h5>
                  <p className="price">{formatPrice(course.pricing)}</p>

                  <div className="course-meta">
                    <div className="meta-item">
                      <FaUserGroup />
                      <span>{getStudentCount()}</span>
                    </div>
                    <div className="meta-item">
                      <FaPlay />
                      <span>{getTotalLessons(course.chapters)}</span>
                    </div>
                    <div className="meta-item">
                      <FaRegClock />
                      <span>{formatDuration(course.time?.durationHours)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="posts">
        <SectionHead title="Bài viết nổi bật" linkText="Xem tất cả" />

        {loadingArticles ? (
          <div className="loading">Đang tải bài viết...</div>
        ) : articles.length === 0 ? (
          <div className="no-articles">Chưa có bài viết nào</div>
        ) : (
          <div className="post-list">
            {articles.slice(0, 4).map((article) => (
              <div
                className="post-card"
                key={article._id}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/article/${article._id}`)}
              >
                <div className="post-thumb">
                  <img
                    src={article.image}
                    alt={article.title}
                    onError={(e) =>
                      (e.target.src = "/images/course-placeholder.png")
                    }
                  />
                </div>
                <div className="post-body">
                  <h6>{article.title}</h6>
                  <p className="p-meta">{getAuthorDisplay(article)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
