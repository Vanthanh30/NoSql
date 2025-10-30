import React, { useState } from "react";
import { ChevronLeft, RotateCcw, Share2, MoreVertical } from "lucide-react";
import "./CourseVideo.scss";

export default function CourseVideo() {
  const [currentLesson, setCurrentLesson] = useState(0);

  const courseInfo = {
    title: "Xây Dựng Website với ReactJS",
    progress: 0,
    totalLessons: 118,
    notes: "Ghi chú",
    questions: "Hướng dẫn",
  };

  const lessons = [
    {
      id: 1,
      title: "Khóa Học SQL Server - Bài 01. Hướng dẫn cài đặt SQL Server",
      duration: "6:47",
      videoId: "dQw4w9WgXcQ",
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=120&fit=crop",
    },
    {
      id: 2,
      title: "Khóa Học SQL Server - Bài 02. Hướng dẫn cài đặt SSMS SQL",
      duration: "6:42",
      videoId: "dQw4w9WgXcQ",
      thumbnail:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=200&h=120&fit=crop",
    },
    {
      id: 3,
      title: "Khóa Học SQL Server - Bài 03. Chuẩn bị cơ sở dữ liệu để thực",
      duration: "6:10",
      videoId: "dQw4w9WgXcQ",
      thumbnail:
        "https://images.unsplash.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=200&h=420&fit=crop",
    },
    {
      id: 4,
      title: "Khóa Học SQL Server - Bài 04. Câu lệnh truy vấn SELECT",
      duration: "22:00",
      videoId: "dQw4w9WgXcQ",
      thumbnail:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=120&fit=crop",
    },
    {
      id: 5,
      title: "Khóa Học SQL Server - Bài 05. Câu lệnh truy vấn SELECT...",
      duration: "14:35",
      videoId: "dQw4w9WgXcQ",
      thumbnail:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=120&fit=crop",
    },
    {
      id: 6,
      title: "Khóa Học SQL Server - Bài 06. Câu lệnh truy vấn SELECT TOP",
      duration: "8:15",
      videoId: "dQw4w9WgXcQ",
      thumbnail:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=120&fit=crop",
    },
  ];

  const currentVideo = lessons[currentLesson];

  return (
    <div className="course-video-page">
      <div className="top-nav">
        <div className="nav-left">
          <button className="btn-back">
            <ChevronLeft size={20} />
          </button>
          <div className="course-badge">
            <span className="course-name">{courseInfo.title}</span>
          </div>
        </div>
        <div className="nav-right">
          <span className="progress-text">{courseInfo.progress}%</span>
          <span className="lesson-count">
            {currentLesson + 1}/{courseInfo.totalLessons} bài học
          </span>
          <button className="nav-btn">{courseInfo.notes}</button>
          <button className="nav-btn">{courseInfo.questions}</button>
        </div>
      </div>

      <div className="content-wrapper">
        <div className="video-section">
          <div className="video-container">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${currentVideo.videoId}`}
              title={currentVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="video-info">
            <h1 className="video-title">{currentVideo.title}</h1>
            <p className="video-date">Cập nhật tháng 11 năm 2022</p>

            <div className="video-description">
              <p>
                Tham gia các cộng đồng để cùng học hỏi, chúc các bạn học tập tốt
                và thành công!
              </p>
              <ul className="social-links">
                <li>
                  Fanpage:{" "}
                  <a href="" target="_blank" rel="noopener noreferrer"></a>
                </li>
                <li>
                  Group:{" "}
                  <a href="" target="_blank" rel="noopener noreferrer"></a>
                </li>
                <li>
                  Youtube:{" "}
                  <a href="" target="_blank" rel="noopener noreferrer"></a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="playlist-sidebar">
          <div className="playlist-header">
            <h2 className="playlist-title">
              Khóa học SQL Server cho người mới
            </h2>
          </div>

          <div className="lesson-note">
            <span className="note-icon">+</span>
            <span>Thêm ghi chú tại 00:00</span>
          </div>

          <div className="lessons-list">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`lesson-item ${
                  index === currentLesson ? "active" : ""
                }`}
                onClick={() => setCurrentLesson(index)}
              >
                <div className="lesson-number">{index + 1}</div>
                <div className="lesson-thumbnail">
                  <img src={lesson.thumbnail} alt={lesson.title} />
                  <span className="lesson-duration">{lesson.duration}</span>
                  {index === currentLesson && (
                    <div className="play-overlay">▶</div>
                  )}
                </div>
                <div className="lesson-info">
                  <h3 className="lesson-title">{lesson.title}</h3>
                  <span className="lesson-channel">TITV</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky-nav-footer active-on-desktop">
        <div className="video-nav-buttons">
          <button
            className="btn-nav-video btn-prev"
            disabled={currentLesson === 0}
            onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
          >
            <ChevronLeft size={16} />
            BÀI TRƯỚC
          </button>
          <button
            className="btn-nav-video btn-next"
            disabled={currentLesson === lessons.length - 1}
            onClick={() =>
              setCurrentLesson(Math.min(lessons.length - 1, currentLesson + 1))
            }
          >
            BÀI TIẾP THEO
            <ChevronLeft size={16} style={{ transform: "rotate(180deg)" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
