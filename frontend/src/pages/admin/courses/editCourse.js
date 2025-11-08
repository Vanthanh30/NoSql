import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import courseService from "../../../services/admin/courseService";
import TextEditor from "../../../components/TinyMCE/index";
import "./course.scss";

function EditCourse() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [level, setLevel] = useState("");
    const [language, setLanguage] = useState("");
    const [instructor, setInstructor] = useState("");
    const [status, setStatus] = useState("active");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [durationHours, setDurationHours] = useState(0);
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("https://via.placeholder.com/150");
    const [videoPreview, setVideoPreview] = useState("");
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const finalPrice = price > 0 ? Math.round(price * (1 - discount / 100)) : 0;

    // Load course data
    useEffect(() => {
        const loadCourse = async () => {
            try {
                setLoading(true);
                const res = await courseService.getCourseById(id);
                const course = res.course || res;

                setTitle(course.title || "");
                setCategory(course.category || "");
                setLevel(course.level || "");
                setLanguage(course.language || "");
                setInstructor(course.instructor || "");
                setStatus(course.status || "active");

                if (course.time) {
                    setStartDate(course.time.startDate?.split("T")[0] || "");
                    setEndDate(course.time.endDate?.split("T")[0] || "");
                    setDurationHours(course.time.durationHours || 0);
                }

                setDescription(course.description || "");
                setPrice(course.pricing?.price || 0);
                setDiscount(course.pricing?.discount || 0);

                if (course.media?.imageUrl) setImagePreview(course.media.imageUrl);
                if (course.media?.videoUrl) setVideoPreview(course.media.videoUrl);

                // Map chapters and lessons with _id
                const loadedModules =
                    (course.chapters || []).map((ch) => ({
                        _id: ch._id,
                        title: ch.title || "Chương không tên",
                        lessons: (ch.lessons || []).map((les) => ({
                            _id: les._id,
                            title: les.title || "Bài học không tên",
                            videoUrl: les.videoUrl || null,
                        })),
                    })) || [];

                setModules(loadedModules.length ? loadedModules : [{ _id: null, title: "Chương 1", lessons: [] }]);
            } catch (err) {
                console.error("Lỗi load khóa học:", err);
                setError("Không tải được khóa học: " + (err.message || "Lỗi mạng"));
            } finally {
                setLoading(false);
            }
        };

        if (id) loadCourse();
    }, [id]);

    // Preview files
    useEffect(() => {
        if (imageFile) {
            const url = URL.createObjectURL(imageFile);
            setImagePreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [imageFile]);

    useEffect(() => {
        if (videoFile) {
            const url = URL.createObjectURL(videoFile);
            setVideoPreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [videoFile]);

    // Module / Lesson handlers
    const addModule = () => setModules([...modules, { _id: null, title: `Chương ${modules.length + 1}`, lessons: [] }]);
    const removeModule = (id) => setModules(modules.filter((m) => m._id !== id));
    const updateModuleTitle = (id, title) => setModules(modules.map((m) => (m._id === id ? { ...m, title } : m)));

    const addLesson = (moduleId) =>
        setModules(
            modules.map((m) =>
                m._id === moduleId
                    ? { ...m, lessons: [...m.lessons, { _id: null, title: `Bài học ${m.lessons.length + 1}`, videoUrl: null }] }
                    : m
            )
        );

    const removeLesson = (moduleId, lessonId) =>
        setModules(
            modules.map((m) => (m._id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l._id !== lessonId) } : m))
        );

    const updateLessonTitle = (moduleId, lessonId, title) =>
        setModules(
            modules.map((m) =>
                m._id === moduleId
                    ? { ...m, lessons: m.lessons.map((l) => (l._id === lessonId ? { ...l, title } : l)) }
                    : m
            )
        );

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const removeVideo = () => {
        setVideoFile(null);
        setVideoPreview("");
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!(title || "").trim()) return alert("Tên khóa học bắt buộc!");

        try {
            const updateData = {
                title: title.trim(),
                category,
                level,
                language,
                instructor,
                status,
                description: description.trim(),
                pricing: { price: Number(price), discount: Number(discount) },
                time: { startDate, endDate, durationHours: Number(durationHours) },
                chapters: modules.map((ch) => ({
                    _id: ch._id,
                    title: ch.title.trim(),
                    lessons: (ch.lessons || []).map((l) => ({
                        _id: l._id,
                        title: l.title.trim(),
                    })),
                })),
            };

            // 2. FormData
            const formData = new FormData();
            formData.append("data", JSON.stringify(updateData));

            // 3. Files chính
            if (imageFile) formData.append("imageFile", imageFile);
            if (videoFile) formData.append("videoFile", videoFile);

            // 4. Lesson video
            modules.forEach((ch, chIndex) => {
                (ch.lessons || []).forEach((les, lesIndex) => {
                    if (les.videoFile) {
                        formData.append(`lessonVideo_${chIndex}_${lesIndex}`, les.videoFile);
                    }
                });
            });
            // 5. Thêm updatedBy (id người đang đăng nhập)
            const currentUserId = localStorage.getItem("userId");
            if (currentUserId) {
                formData.append("account_id", currentUserId);
            }

            // 6. Gọi API
            await courseService.updateCourse(id, formData);

            alert("Cập nhật khóa học thành công!");
            navigate("/admin/courses");
        } catch (err) {
            console.error("Lỗi cập nhật:", err);
            alert("Cập nhật thất bại: " + (err?.response?.data?.error || err.message));
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Xóa vĩnh viễn khóa học này?")) return;
        try {
            await courseService.deleteCourse(id);
            alert("Xóa thành công!");
            navigate("/admin/courses");
        } catch {
            alert("Xóa thất bại!");
        }
    };

    return (
        <div className="add-course">
            <div className="add-course__header">
                <h1>Chỉnh sửa khóa học</h1>
                <div className="add-course__header-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => window.location.reload()}>
                        Làm mới
                    </button>
                    <button type="button" className="btn btn-danger" onClick={handleDelete}>
                        Xóa khóa học
                    </button>
                    <button type="submit" form="edit-course-form" className="btn btn-primary">
                        Lưu khóa học
                    </button>
                </div>
            </div>

            <form id="edit-course-form" className="add-course__form" onSubmit={handleSubmit}>
                {/* LEFT COLUMN */}
                <div className="add-course__left">
                    <div className="form-group">
                        <label>Tên khóa học</label>
                        <input
                            className="form-control"
                            placeholder="Nhập tên khóa học"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid-3">
                        <div className="form-group">
                            <label>Danh mục</label>
                            <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="">Chọn danh mục</option>
                                <option value="Frontend">Frontend</option>
                                <option value="Backend">Backend</option>
                                <option value="Mobile">Mobile</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Trình độ</label>
                            <select className="form-control" value={level} onChange={(e) => setLevel(e.target.value)}>
                                <option value="">Chọn trình độ</option>
                                <option value="basic">Cơ bản</option>
                                <option value="intermediate">Trung cấp</option>
                                <option value="advanced">Nâng cao</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Ngôn ngữ</label>
                            <select className="form-control" value={language} onChange={(e) => setLanguage(e.target.value)}>
                                <option value="">Chọn ngôn ngữ</option>
                                <option value="vietnamese">Tiếng Việt</option>
                                <option value="english">Tiếng Anh</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Mô tả chi tiết</label>
                        <TextEditor value={description} onChange={setDescription} />
                    </div>

                    <div className="panel">
                        <div className="panel__title">Nội dung khóa học</div>
                        <div className="modules">
                            {modules.map((module) => (
                                <div key={module.id} className="module">
                                    <div className="module__header">
                                        <input
                                            className="form-control"
                                            value={module.title}
                                            onChange={(e) => updateModuleTitle(module.id, e.target.value)}
                                            placeholder="Tên chương"
                                        />
                                        <div className="module__actions">
                                            <button type="button" className="btn btn-light" onClick={() => addLesson(module.id)}>
                                                + Bài học
                                            </button>
                                            {modules.length > 1 && (
                                                <button type="button" className="btn btn-danger" onClick={() => removeModule(module.id)}>
                                                    Xóa chương
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="lessons">
                                        {module.lessons.map((lesson) => (
                                            <div key={lesson.id} className="lesson">
                                                <div className="lesson__wrapper">
                                                    <input
                                                        className="form-control lesson__title"
                                                        value={lesson.title}
                                                        onChange={(e) => updateLessonTitle(module.id, lesson.id, e.target.value)}
                                                        placeholder="Tên bài học"
                                                    />
                                                    <div className="lesson__right-actions">
                                                        {!lesson.videoFile && !lesson.videoUrl ? (
                                                            <>
                                                                <label className="lesson__upload-btn">
                                                                    Tải video
                                                                    <input
                                                                        type="file"
                                                                        accept="video/*"
                                                                        onChange={(e) => handleVideoUpload(module.id, lesson.id, e.target.files[0])}
                                                                    />
                                                                </label>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-ghost lesson__delete"
                                                                    onClick={() => removeLesson(module.id, lesson.id)}
                                                                >
                                                                    x
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <div className="lesson__video-info">
                                                                <span className="video-name">
                                                                    {lesson.videoFile?.name || "Đã có video"}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-ghost btn-sm"
                                                                    onClick={() => removeVideo(module.id, lesson.id)}
                                                                >
                                                                    x
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-ghost lesson__delete"
                                                                    onClick={() => removeLesson(module.id, lesson.id)}
                                                                >
                                                                    x
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {(lesson.videoFile || lesson.videoUrl) && (
                                                    <div className="lesson__preview">
                                                        <video
                                                            src={lesson.videoUrl || URL.createObjectURL(lesson.videoFile)}
                                                            controls
                                                            className="video-thumb"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {module.lessons.length === 0 && <div className="muted">Chưa có bài học</div>}
                                    </div>
                                </div>
                            ))}

                            <button type="button" className="btn btn-outline" onClick={addModule}>
                                + Thêm chương
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN – HIỂN THỊ ĐÚNG */}
                <div className="add-course__right">
                    <div className="form-group">
                        <label>Giảng viên</label>
                        <input
                            className="form-control"
                            placeholder="Tên giảng viên"
                            value={instructor}
                            onChange={(e) => setInstructor(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Trạng thái</label>
                        <select
                            className="form-control"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="active">Sắp khai giảng</option>
                            <option value="ongoing">Đang diễn ra</option>
                            <option value="completed">Hoàn thành</option>
                            <option value="cancelled">Đã hủy</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Ngày bắt đầu</label>
                        <input
                            type="date"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Ngày kết thúc</label>
                        <input
                            type="date"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Thời lượng (giờ)</label>
                        <input
                            type="number"
                            min="0"
                            className="form-control"
                            value={durationHours}
                            onChange={(e) => setDurationHours(e.target.value)}
                        />
                    </div>

                    <div className="panel">
                        <div className="panel__title">Ảnh đại diện</div>
                        <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                        <img
                            className="preview-image"
                            src={imagePreview}
                            alt="preview"
                            style={{ width: '100%', marginTop: '8px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                    </div>

                    <div className="panel">
                        <div className="panel__title">Video giới thiệu</div>
                        <input
                            type="file"
                            accept="video/*"
                            className="form-control"
                            onChange={(e) => setVideoFile(e.target.files[0])}
                        />
                        {videoPreview && (
                            <video
                                className="preview-video"
                                src={videoPreview}
                                controls
                                style={{ width: '100%', marginTop: '8px', borderRadius: '8px' }}
                            />
                        )}
                    </div>

                    <div className="panel">
                        <div className="panel__title">Học phí</div>
                        <div className="grid-2">
                            <div className="form-group">
                                <label>Giá gốc (VNĐ)</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="form-control"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Giảm giá (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="form-control"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="final-price">
                            Giá sau giảm: <strong>{finalPrice.toLocaleString()} VNĐ</strong>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditCourse;