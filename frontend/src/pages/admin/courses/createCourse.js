import './course.scss';
import TextEditor from '../../../components/TinyMCE/index';
import { useState, useRef } from 'react';
import courseService from '../../../services/admin/courseService';
import chapterService from '../../../services/admin/chapterService';
import lessonService from '../../../services/admin/lessonService';

function CreateCourse() {
    const [modules, setModules] = useState([]);

    const [courseData, setCourseData] = useState({
        title: '', category: '', level: 'basic', language: 'vietnamese',
        instructor: '', status: 'upcoming', startDate: '', endDate: '',
        durationHours: 0, price: 0, discount: 0,
        imageFile: null, introVideoFile: null,
    });

    const [previewImage, setPreviewImage] = useState('https://via.placeholder.com/150');
    const [previewIntroVideo, setPreviewIntroVideo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const editorRef = useRef(null);
    const finalPrice = courseData.price * (1 - courseData.discount / 100);

    // === UI HANDLERS (GIỮ NGUYÊN 100%) ===
    const handleInput = (e) => {
        const { name, value } = e.target;
        setCourseData(prev => ({ ...prev, [name]: value }));
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCourseData(prev => ({ ...prev, imageFile: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleIntroVideo = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCourseData(prev => ({ ...prev, introVideoFile: file }));
            setPreviewIntroVideo(URL.createObjectURL(file));
        }
    };

    const addModule = () => setModules(prev => [...prev, { id: Date.now(), title: `Chương ${prev.length + 1}`, lessons: [] }]);
    const removeModule = (id) => setModules(prev => prev.filter(m => m.id !== id));
    const updateModuleTitle = (id, title) => setModules(prev => prev.map(m => m.id === id ? { ...m, title } : m));

    const addLesson = (moduleId) => {
        setModules(prev => prev.map(m =>
            m.id === moduleId
                ? { ...m, lessons: [...m.lessons, { id: Date.now(), title: `Bài học ${m.lessons.length + 1}`, videoFile: null, videoUrl: null }] }
                : m
        ));
    };

    const updateLessonTitle = (moduleId, lessonId, title) => {
        setModules(prev => prev.map(m =>
            m.id === moduleId
                ? { ...m, lessons: m.lessons.map(l => l.id === lessonId ? { ...l, title } : l) }
                : m
        ));
    };

    const handleVideoUpload = (moduleId, lessonId, file) => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        setModules(prev => prev.map(m =>
            m.id === moduleId
                ? { ...m, lessons: m.lessons.map(l => l.id === lessonId ? { ...l, videoFile: file, videoUrl: url } : l) }
                : m
        ));
    };

    const removeVideo = (moduleId, lessonId) => {
        setModules(prev => prev.map(m =>
            m.id === moduleId
                ? { ...m, lessons: m.lessons.map(l => l.id === lessonId ? { ...l, videoFile: null, videoUrl: null } : l) }
                : m
        ));
    };
    const removeLesson = (moduleId, lessonId) => {
        setModules(prev => prev.map(m =>
            m.id === moduleId
                ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }
                : m
        ));
    };
    // === SUBMIT: DÙNG ĐỦ 3 SERVICE ===
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!courseData.title || !courseData.imageFile) {
            setMessage('Vui lòng nhập tên và chọn ảnh!');
            return;
        }
        setLoading(true); setMessage('');
        try { // ======= 1. Tạo khóa học ======= 
            const formData = new FormData();
            formData.append('title', courseData.title);
            formData.append('category', courseData.category || 'Uncategorized');
            formData.append('level', courseData.level);
            formData.append('language', courseData.language);
            formData.append('instructor', courseData.instructor || 'Admin');
            formData.append('status', courseData.status);
            formData.append('time[startDate]', courseData.startDate);
            formData.append('time[endDate]', courseData.endDate);
            formData.append('time[durationHours]',
                courseData.durationHours);
            formData.append('pricing[price]',
                courseData.price);
            formData.append('pricing[discount]',
                courseData.discount);
            formData.append('description', editorRef.current?.getContent() || '');
            formData.append('createdBy[account_id]', 'admin');
            // Ảnh + video tổng khóa học 
            formData.append('imageUrl',
                courseData.imageFile);
            if (courseData.introVideoFile) {
                formData.append('videoUrl', courseData.introVideoFile);
            }
            // ======= Thêm chapters và lesson title (không video) ======= 
            modules.forEach((m, mi) => {
                formData.append(`chapters[${mi}][title]`, m.title);
                m.lessons.forEach((l, li) => {
                    formData.append(`chapters[${mi}][lessons][${li}][title]`, l.title);
                });
            });
            const createdCourse = await courseService.createCourse(formData);
            // ======= 2. Upload video cho từng lesson đã có trong DB =======
            if (createdCourse && createdCourse.chapters) {
                const updatedModules = [...modules]; // copy modules hiện tại

                for (let mi = 0; mi < createdCourse.chapters.length; mi++) {
                    const backendChapter = createdCourse.chapters[mi];
                    const localModule = updatedModules[mi];

                    for (let li = 0; li < backendChapter.lessons.length; li++) {
                        const backendLesson = backendChapter.lessons[li];
                        const localLesson = localModule.lessons[li];

                        if (localLesson.videoFile) {
                            try {
                                const updatedLesson = await lessonService.uploadVideoForLesson(
                                    backendLesson._id,      // ID thật từ DB
                                    localLesson.videoFile   // File object
                                );

                                // cập nhật videoUrl từ backend
                                localLesson.videoUrl = updatedLesson.videoUrl;

                            } catch (err) {
                                console.error(`Lỗi upload video cho "${localLesson.title}":`, err.response?.data || err.message);
                            }
                        }
                    }
                }

                // Cập nhật lại state modules để UI hiển thị videoUrl thật
                setModules(updatedModules);
            }
            setMessage('Tạo khóa học và upload video thành công!');
            setTimeout(() => window.location.href = '/admin/courses', 1500);
        } catch (error) {
            console.error('Lỗi:', error.response?.data || error.message);
            setMessage('Lỗi: ' + (error.response?.data?.error || 'Lỗi server'));
        } finally {
            setLoading(false);
        }
    };

    // === UI GIỮ NGUYÊN 100% (copy từ bạn) ===
    return (
        <div className="add-course">
            <div className="add-course__header">
                <h1>Thêm khóa học mới</h1>
                <div className="add-course__header-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => window.location.reload()}>
                        Làm mới
                    </button>
                    <button type="submit" form="add-course-form" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Đang lưu...' : 'Lưu khóa học'}
                    </button>
                </div>
            </div>

            {message && (
                <div className={`alert ${message.includes('thành công') ? 'alert-success' : 'alert-danger'}`}>
                    {message}
                </div>
            )}

            <form id="add-course-form" onSubmit={handleSubmit} className="add-course__form">
                {/* LEFT */}
                <div className="add-course__left">
                    <div className="form-group">
                        <label>Tên khóa học *</label>
                        <input name="title" className="form-control" required value={courseData.title} onChange={handleInput} />
                    </div>

                    <div className="grid-3">
                        <div className="form-group">
                            <label>Danh mục *</label>
                            <select name="category" className="form-control" required value={courseData.category} onChange={handleInput}>
                                <option value="">Chọn danh mục</option>
                                <option>BackEnd</option>
                                <option>FrontEnd</option>
                                <option>FullStack</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Trình độ</label>
                            <select name="level" className="form-control" value={courseData.level} onChange={handleInput}>
                                <option value="basic">Cơ bản</option>
                                <option value="intermediate">Trung cấp</option>
                                <option value="advanced">Nâng cao</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Ngôn ngữ</label>
                            <select name="language" className="form-control" value={courseData.language} onChange={handleInput}>
                                <option value="vietnamese">Tiếng Việt</option>
                                <option value="english">Tiếng Anh</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Mô tả chi tiết</label>
                        <TextEditor ref={editorRef} />
                    </div>

                    <div className="panel">
                        <div className="panel__title">Nội dung khóa học</div>
                        <div className="modules">
                            {modules.map(module => (
                                <div key={module.id} className="module">
                                    <div className="module__header">
                                        <input
                                            className="form-control"
                                            value={module.title}
                                            onChange={e => updateModuleTitle(module.id, e.target.value)}
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
                                        {module.lessons.map(lesson => (
                                            <div key={lesson.id} className="lesson">
                                                <div className="lesson__wrapper">
                                                    <input
                                                        className="form-control lesson__title"
                                                        value={lesson.title}
                                                        onChange={e => updateLessonTitle(module.id, lesson.id, e.target.value)}
                                                    />
                                                    <div className="lesson__right-actions">
                                                        {!lesson.videoFile ? (
                                                            <label className="lesson__upload-btn">
                                                                Tải video
                                                                <input
                                                                    type="file"
                                                                    accept="video/*"
                                                                    onChange={e => handleVideoUpload(module.id, lesson.id, e.target.files[0])}
                                                                />
                                                            </label>
                                                        ) : (
                                                            <div className="lesson__video-info">
                                                                <span>{lesson.videoFile.name}</span>
                                                                <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeVideo(module.id, lesson.id)}>x</button>
                                                            </div>
                                                        )}
                                                        <button
                                                            type="button"
                                                            className="btn btn-ghost lesson__delete"
                                                            onClick={() => removeLesson(module.id, lesson.id)}
                                                        >
                                                            x
                                                        </button>
                                                    </div>
                                                </div>
                                                {lesson.videoFile && (
                                                    <div className="lesson__preview">
                                                        <video src={lesson.videoUrl} controls className="video-thumb" />
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

                {/* RIGHT */}
                <div className="add-course__right">
                    <div className="form-group">
                        <label>Giảng viên</label>
                        <input name="instructor" className="form-control" value={courseData.instructor} onChange={handleInput} />
                    </div>

                    <div className="form-group">
                        <label>Trạng thái</label>
                        <select name="status" className="form-control" value={courseData.status} onChange={handleInput}>
                            <option value="upcoming">Sắp khai giảng</option>
                            <option value="ongoing">Đang diễn ra</option>
                            <option value="completed">Hoàn thành</option>
                            <option value="canceled">Đã hủy</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Ngày bắt đầu</label>
                        <input type="date" name="startDate" className="form-control" value={courseData.startDate} onChange={handleInput} />
                    </div>

                    <div className="form-group">
                        <label>Ngày kết thúc</label>
                        <input type="date" name="endDate" className="form-control" value={courseData.endDate} onChange={handleInput} />
                    </div>

                    <div className="form-group">
                        <label>Thời lượng (giờ)</label>
                        <input type="number" name="durationHours" className="form-control" value={courseData.durationHours} onChange={handleInput} />
                    </div>

                    <div className="panel">
                        <div className="panel__title">Ảnh đại diện *</div>
                        <input type="file" accept="image/*" required onChange={handleImage} />
                        <img src={previewImage} alt="preview" className="preview-image" />
                    </div>

                    <div className="panel">
                        <div className="panel__title">Video giới thiệu</div>
                        <input type="file" accept="video/*" onChange={handleIntroVideo} />
                        {previewIntroVideo && <video src={previewIntroVideo} controls className="preview-video" />}
                    </div>

                    <div className="panel">
                        <div className="panel__title">Học phí</div>
                        <div className="grid-2">
                            <div className="form-group">
                                <label>Giá gốc (VNĐ)</label>
                                <input type="number" name="price" className="form-control" value={courseData.price} onChange={handleInput} />
                            </div>
                            <div className="form-group">
                                <label>Giảm giá (%)</label>
                                <input type="number" name="discount" min="0" max="100" className="form-control" value={courseData.discount} onChange={handleInput} />
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