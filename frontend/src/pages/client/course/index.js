import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./course.scss";
import { FaPlayCircle, FaArrowLeft, FaClock, FaFilm, FaLaptopCode, FaGlobe } from "react-icons/fa";
import YouTube from "react-youtube";

import post1 from "../../../assets/images/post1.png";
import post2 from "../../../assets/images/post2.png";
import post3 from "../../../assets/images/post3.png";

const tempCourses = [
    {
        id: 1,
        title: "Kiến Thức Nhập Môn IT",
        description: "Khóa học cung cấp kiến thức nền tảng về ngành IT.",
        thumbnail: post1,
        videoUrl: "tgbNymZ7vqY",
        lessons: [
            { id: 1, name: "Mô hình Client - Server là gì?", time: "00:11" },
            { id: 2, name: "Domain là gì? Tên miền là gì?", time: "01:30" },
            { id: 3, name: "Mua tên miền, hosting ở đâu?", time: "02:45" },
        ],
        level: "Cơ bản",
        totalLessons: 12,
        duration: "03 giờ 26 phút",
    },
    {
        id: 2,
        title: "Lập Trình C++ Cơ Bản",
        description: "Khóa học giúp bạn nắm vững C++ cơ bản.",
        thumbnail: post2,
        videoUrl: "8jLOx1hD3_o",
        lessons: [
            { id: 1, name: "Giới thiệu ngôn ngữ C++", time: "00:09" },
            { id: 2, name: "Cấu trúc chương trình", time: "00:20" },
        ],
        level: "Cơ bản",
        totalLessons: 8,
        duration: "02 giờ 10 phút",
    },
    {
        id: 3,
        title: "HTML, CSS Từ Zero Đến Hero",
        description: "Học HTML và CSS cơ bản đến nâng cao.",
        thumbnail: post3,
        videoUrl: "dD2EISBDjWM",
        lessons: [
            { id: 1, name: "HTML cơ bản", time: "00:12" },
            { id: 2, name: "CSS cơ bản", time: "00:14" },
        ],
        level: "Cơ bản",
        totalLessons: 10,
        duration: "02 giờ 45 phút",
    },
];

const CoursePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const course = tempCourses.find((c) => c.id === Number(id));
    const [playVideo, setPlayVideo] = useState(false);
    const [player, setPlayer] = useState(null);

    if (!course) return <h2 className="not-found">Khóa học không tồn tại</h2>;

    const opts = { height: "300", width: "100%", playerVars: { autoplay: 0 } };
    const onReady = (event) => setPlayer(event.target);

    const handleLessonClick = (time) => {
        if (!player) return;
        const [mm, ss] = time.split(":").map(Number);
        const seconds = mm * 60 + ss;
        player.seekTo(seconds);
        player.playVideo();
        setPlayVideo(true);
    };

    return (
        <div className="course-detail">
            <div className="back-button" onClick={() => navigate(-1)}>
                <FaArrowLeft className="icon" /> Quay lại
            </div>

            <div className="course-content">
                <h1>{course.title}</h1>
                <p className="desc">{course.description}</p>

                <div className="lesson-list">
                    <h3>Bạn sẽ học được gì?</h3>
                    <ul>
                        {course.lessons.map((l) => (
                            <li key={l.id} onClick={() => handleLessonClick(l.time)}>
                                <FaPlayCircle className="icon" />
                                {l.name}
                                <span className="time">{l.time}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="course-video">
                {!playVideo ? (
                    <div
                        className="video-thumb"
                        style={{ backgroundImage: `url(${course.thumbnail})` }}
                        onClick={() => setPlayVideo(true)}
                    >
                        <FaPlayCircle className="play-icon" />
                    </div>
                ) : (
                    <YouTube videoId={course.videoUrl} opts={opts} onReady={onReady} />
                )}

                <div className="enroll-box">
                    <p className="free">Miễn phí</p>
                    <button className="enroll-btn">Đăng ký học</button>

                    <ul className="course-info">
                        <li><FaLaptopCode className="icon" /> Trình độ <b>{course.level}</b></li>
                        <li><FaFilm className="icon" /> Tổng số <b>{course.totalLessons}</b> bài học</li>
                        <li><FaClock className="icon" /> Thời lượng <b>{course.duration}</b></li>
                        <li><FaGlobe className="icon" /> Học mọi lúc, mọi nơi</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CoursePage;
