import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./course.scss";
import {
  FaPlayCircle,
  FaArrowLeft,
  FaClock,
  FaFilm,
  FaLaptopCode,
  FaGlobe,
  FaCheckCircle,
} from "react-icons/fa";
import courseService from "../../../services/client/courseService";

const CoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playVideo, setPlayVideo] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await courseService.getCourseById(id);
        setCourse(data);
      } catch (err) {
        setError("Không thể tải thông tin khóa học");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const calculateTotalDuration = () => {
    if (!course?.chapters) return "0 giờ 0 phút";

    let totalMinutes = 0;
    course.chapters.forEach((chapter) => {
      chapter.lessons?.forEach((lesson) => {
        if (lesson.duration) {
          totalMinutes += lesson.duration;
        }
      });
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours} giờ ${minutes} phút`;
  };

  const getTotalLessons = () => {
    if (!course?.chapters) return 0;
    return course.chapters.reduce(
      (total, chapter) => total + (chapter.lessons?.length || 0),
      0
    );
  };

  const formatTime = (minutes) => {
    if (!minutes) return "00:00";
    const hrs = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes % 1) * 60);

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getFinalPrice = () => {
    if (!course?.pricing) return 0;
    const { price, discount } = course.pricing;
    if (!price) return 0;
    if (!discount) return price;
    return price - (price * discount) / 100;
  };

  const handleEnrollClick = () => {
    const isLoggedIn = localStorage.getItem("token");

    if (isLoggedIn) {
      navigate(`/learn/${id}`);
    } else {
      alert("Vui lòng đăng nhập để đăng ký khóa học!");

      navigate("/login", { state: { from: window.location.pathname } });
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!course) return <h2 className="not-found">Khóa học không tồn tại</h2>;

  const finalPrice = getFinalPrice();

  return (
    <div className="course-detail">
      <div className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft className="icon" /> Quay lại
      </div>

      <div className="course-content">
        <h1>{course.title}</h1>
        {course.description && (
          <div
            className="desc"
            dangerouslySetInnerHTML={{ __html: course.description }}
          />
        )}

        <div className="lesson-list">
          <h3>Nội dung khóa học</h3>
          {course.chapters?.map((chapter, idx) => (
            <div key={chapter._id} className="chapter-section">
              <h4>
                Chương {idx + 1}: {chapter.title}
              </h4>
              {chapter.description && (
                <p className="chapter-desc">{chapter.description}</p>
              )}
              <ul>
                {chapter.lessons?.map((lesson) => (
                  <li key={lesson._id} className="lesson-preview">
                    {lesson.title}
                    {lesson.duration && (
                      <span className="time">
                        {formatTime(lesson.duration)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="course-video">
        {!playVideo ? (
          <div
            className="video-thumb"
            style={{
              backgroundImage: `url(${course.media?.imageUrl || ""})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={() => setPlayVideo(true)}
          >
            <FaPlayCircle className="play-icon" />
          </div>
        ) : (
          <div className="video-wrapper">
            <video
              controls
              className="course-video-player"
              style={{ width: "100%", height: "300px" }}
              key={"default-video"}
            >
              <source src={course.media?.videoUrl} type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          </div>
        )}

        <div className="enroll-box">
          {finalPrice > 0 ? (
            <>
              <p className="price">{finalPrice.toLocaleString("vi-VN")} đ</p>
              {course.pricing?.discount > 0 && (
                <p className="original-price">
                  <del>{course.pricing.price.toLocaleString("vi-VN")} đ</del>
                  <span className="discount">-{course.pricing.discount}%</span>
                </p>
              )}
            </>
          ) : (
            <p className="free">Miễn phí</p>
          )}

          <button className="enroll-btn" onClick={handleEnrollClick}>
            Đăng ký học
          </button>

          <ul className="course-info">
            <li>
              <FaLaptopCode className="icon" />
              Trình độ <b>{course.level}</b>
            </li>
            <li>
              <FaFilm className="icon" />
              Tổng số <b>{getTotalLessons()}</b> bài học
            </li>
            <li>
              <FaClock className="icon" />
              Thời lượng <b>{course.time?.durationHours || 0} giờ</b>
            </li>
            <li>
              <FaGlobe className="icon" />
              Học mọi lúc, mọi nơi
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
