import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./course.scss";
import {
  FaArrowLeft,
  FaPlayCircle,
  FaCheckCircle,
  FaFileAlt,
} from "react-icons/fa";
import courseService from "../../../services/client/courseService";

const LearningPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  const flattenLessons = (chapters) => {
    let lessons = [];
    chapters?.forEach((chapter) => {
      lessons = lessons.concat(chapter.lessons || []);
    });
    return lessons;
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await courseService.getCourseById(id);
        setCourse(data);

        const firstLesson = flattenLessons(data.chapters)[0];
        if (firstLesson) {
          setCurrentLesson(firstLesson);
          setSelectedLessonId(firstLesson._id);
        }
      } catch (err) {
        setError("Không thể tải thông tin khóa học");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleLessonClick = (lesson) => {
    setCurrentLesson(lesson);
    setSelectedLessonId(lesson._id);
  };

  const formatTime = (minutes) => {
    if (!minutes) return "00:00";
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes % 1) * 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!course) return <h2 className="not-found">Khóa học không tồn tại</h2>;
  if (!currentLesson)
    return <div className="no-lesson">Không tìm thấy bài học nào.</div>;

  const currentVideoUrl = currentLesson.videoUrl || course.media?.videoUrl;

  return (
    <div className="course-detail learning-mode">
      <div className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft className="icon" /> Quay lại
      </div>

      <div className="course-video">
        <div className="video-wrapper">
          {currentVideoUrl ? (
            <>
              <video
                controls
                autoPlay
                className="course-video-player"
                style={{ width: "100%", maxHeight: "calc(100vh - 100px)" }}
                key={currentLesson._id}
              >
                <source src={currentVideoUrl} type="video/mp4" />
                Trình duyệt của bạn không hỗ trợ video.
              </video>
              <div className="video-lesson-title">
                <h3>{currentLesson.title}</h3>
              </div>
              <div className="lesson-description">
                <h5>Mô tả khóa học:</h5>
                <div dangerouslySetInnerHTML={{ __html: course.description }} />
              </div>
            </>
          ) : (
            <div className="no-video">
              <FaFileAlt className="play-icon" />
              <p>Không có video cho bài học này.</p>
              <p>Đang xem: {currentLesson.title}</p>
            </div>
          )}
        </div>
      </div>

      <div className="lesson-list-sidebar">
        <h3>{course.title}</h3>
        <p className="lesson-count">
          Tổng {flattenLessons(course.chapters).length} bài học
        </p>

        {course.chapters?.map((chapter, idx) => (
          <div key={chapter._id} className="chapter-section">
            <h4>
              Chương {idx + 1}: {chapter.title}
            </h4>
            <ul>
              {chapter.lessons?.map((lesson) => (
                <li
                  key={lesson._id}
                  onClick={() => handleLessonClick(lesson)}
                  className={selectedLessonId === lesson._id ? "active" : ""}
                >
                  {selectedLessonId === lesson._id ? (
                    <FaCheckCircle className="icon active-icon" />
                  ) : (
                    <FaPlayCircle className="icon" />
                  )}
                  <span style={{ flex: 1 }}>
                    {lesson.title.replace(/(bài học \d+)/i, "$1:")}
                  </span>
                  {lesson.duration && (
                    <span className="time">{formatTime(lesson.duration)}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPage;
