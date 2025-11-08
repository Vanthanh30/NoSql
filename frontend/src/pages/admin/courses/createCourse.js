import './course.scss';
import TextEditor from '../../../components/TinyMCE/index';
import { useState, useEffect } from 'react';
import courseService from '../../../services/admin/courseService';
import { useNavigate } from 'react-router-dom';

function CreateCourse() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [level, setLevel] = useState('');
    const [language, setLanguage] = useState('');
    const [instructor, setInstructor] = useState('');
    const [status, setStatus] = useState('active');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [duration, setDuration] = useState(0);
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('https://via.placeholder.com/150');
    const [videoPreview, setVideoPreview] = useState('');

    // ----- Modules / Lessons -----
    const [modules, setModules] = useState([
        { id: 1, title: 'Chương 1', lessons: [{ id: 1, title: 'Bài học 1', videoFile: null, videoUrl: null }] }
    ]);

    // Tính giá sau giảm
    const finalPrice = price > 0 ? Math.round(price * (1 - discount / 100)) : 0;

    // Preview ảnh
    useEffect(() => {
        if (imageFile) {
            const url = URL.createObjectURL(imageFile);
            setImagePreview(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setImagePreview('https://via.placeholder.com/150');
        }
    }, [imageFile]);

    // Preview video giới thiệu
    useEffect(() => {
        if (videoFile) {
            const url = URL.createObjectURL(videoFile);
            setVideoPreview(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setVideoPreview('');
        }
    }, [videoFile]);

    // ----- Module & Lesson Handlers -----
    const addModule = () => {
        const newModule = { id: Date.now(), title: `Chương ${modules.length + 1}`, lessons: [] };
        setModules([...modules, newModule]);
    };

    const removeModule = (moduleId) => {
        if (modules.length > 1) {
            setModules(modules.filter(m => m.id !== moduleId));
        }
    };

    const updateModuleTitle = (moduleId, title) => {
        setModules(modules.map(m => m.id === moduleId ? { ...m, title } : m));
    };

    const addLesson = (moduleId) => {
        const module = modules.find(m => m.id === moduleId);
        const newLesson = {
            id: Date.now(),
            title: `Bài học ${module.lessons.length + 1}`,
            videoFile: null,
            videoUrl: null
        };
        setModules(modules.map(m => m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m));
    };

    const removeLesson = (moduleId, lessonId) => {
        setModules(modules.map(m => m.id === moduleId ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } : m));
    };

    const updateLessonTitle = (moduleId, lessonId, title) => {
        setModules(modules.map(m => m.id === moduleId ? {
            ...m,
            lessons: m.lessons.map(l => l.id === lessonId ? { ...l, title } : l)
        } : m));
    };

    const handleVideoUpload = (moduleId, lessonId, file) => {
        if (file && file.type.startsWith('video/')) {
            const videoUrl = URL.createObjectURL(file);
            setModules(modules.map(m => m.id === moduleId ? {
                ...m,
                lessons: m.lessons.map(l => l.id === lessonId ? { ...l, videoFile: file, videoUrl } : l)
            } : m));
        }
    };

    const removeVideo = (moduleId, lessonId) => {
        setModules(modules.map(m => m.id === moduleId ? {
            ...m,
            lessons: m.lessons.map(l => l.id === lessonId ? { ...l, videoFile: null, videoUrl: null } : l)
        } : m));
    };

    // ----- Handle form submit -----
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('Vui lòng nhập tên khóa học!');
            return;
        }

        const chapters = modules
            .filter(m => m.title.trim())
            .map(m => ({
                title: m.title.trim(),
                lessons: m.lessons
                    .filter(l => l.title.trim())
                    .map(l => ({
                        title: l.title.trim(),
                        videoFile: l.videoFile || null
                    }))
            }));

        if (chapters.length === 0) {
            alert('Vui lòng thêm ít nhất 1 chương!');
            return;
        }
        if (chapters.some(ch => ch.lessons.length === 0)) {
            alert('Mỗi chương phải có ít nhất 1 bài học!');
            return;
        }

        const courseData = {
            title: title.trim(),
            category: category || '',
            level: level || '',
            language: language || '',
            instructor: instructor || '',
            status: status || 'active',
            description: description || '',
            pricing: {
                price: Number(price) || 0,
                discount: Number(discount) || 0
            },
            chapters,
            imageFile: imageFile || null,
            videoFile: videoFile || null
        };

        try {
            const res = await courseService.createCourse(courseData);
            alert('Tạo khóa học thành công!');
            console.log('Khóa học:', res);
            navigate('/admin/courses')
        } catch (err) {
            const msg = err?.error || err?.message || 'Lỗi không xác định';
            alert('Tạo khóa học thất bại: ' + msg);
            console.error('Error:', err);
        }
    };
    return (
        <div className="add-course">
            <div className="add-course__header">
                <h1>Thêm khóa học mới</h1>
                <div className="add-course__header-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => window.location.reload()}>
                        Làm mới
                    </button>
                    <button type="submit" form="add-course-form" className="btn btn-primary">
                        Lưu khóa học
                    </button>
                </div>
            </div>

            <form id="add-course-form" className="add-course__form" onSubmit={handleSubmit}>
                {/* Left column */}
                <div className="add-course__left">
                    <div className="form-group">
                        <label htmlFor="title">Tên khóa học</label>
                        <input
                            id="title"
                            className="form-control"
                            placeholder="Nhập tên khóa học"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid-3">
                        <div className="form-group">
                            <label>Danh mục</label>
                            <select
                                className="form-control"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Chọn danh mục</option>
                                <option value="Frontend">Frontend</option>
                                <option value="Backend">Backend</option>
                                <option value="Mobile">Mobile</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Trình độ</label>
                            <select
                                className="form-control"
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                            >
                                <option value="">Chọn trình độ</option>
                                <option value="basic">Cơ bản</option>
                                <option value="intermediate">Trung cấp</option>
                                <option value="advanced">Nâng cao</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Ngôn ngữ</label>
                            <select
                                className="form-control"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            >
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
                                                        {!lesson.videoFile ? (
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
                                                                <span className="video-name">{lesson.videoFile.name}</span>
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

                                                {lesson.videoFile && (
                                                    <div className="lesson__preview">
                                                        <video src={lesson.videoUrl} controls className="video-thumb" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {module.lessons.length === 0 && (
                                            <div className="muted">Chưa có bài học</div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <button type="button" className="btn btn-outline" onClick={addModule}>
                                + Thêm chương
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right column */}
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
                            placeholder="0"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
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
                        <img className="preview-image" src={imagePreview} alt="preview" />
                    </div>

                    <div className="panel">
                        <div className="panel__title">Video giới thiệu</div>
                        <input
                            type="file"
                            accept="video/*"
                            className="form-control"
                            onChange={(e) => setVideoFile(e.target.files[0])}
                        />
                        {videoPreview ? (
                            <video className="preview-video" src={videoPreview} controls style={{ width: '100%', marginTop: '8px' }} />
                        ) : (
                            <video className="preview-video" src="#" controls style={{ width: '100%', marginTop: '8px', display: 'none' }} />
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
                                    placeholder="0"
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
                                    placeholder="0"
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

export default CreateCourse;