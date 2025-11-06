import './course.scss';
import TextEditor from '../../../components/TinyMCE/index';
import { useState } from 'react';

function CreateCourse() {
    const [modules, setModules] = useState([
        {
            id: 1,
            title: 'Chương 1',
            lessons: [
                { id: 1, title: 'bài học 1', videoFile: null, videoUrl: null }
            ]
        }
    ]);

    const addModule = () => {
        const newModule = {
            id: Date.now(),
            title: `Chương ${modules.length + 1}`,
            lessons: []
        };
        setModules([...modules, newModule]);
    };

    const removeModule = (moduleId) => {
        setModules(modules.filter(m => m.id !== moduleId));
    };

    const updateModuleTitle = (moduleId, title) => {
        setModules(modules.map(m => m.id === moduleId ? { ...m, title } : m));
    };

    const addLesson = (moduleId) => {
        const newLesson = {
            id: Date.now(),
            title: `bài học ${modules.find(m => m.id === moduleId).lessons.length + 1}`,
            videoFile: null,
            videoUrl: null
        };
        setModules(modules.map(m =>
            m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
        ));
    };

    const removeLesson = (moduleId, lessonId) => {
        setModules(modules.map(m =>
            m.id === moduleId
                ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }
                : m
        ));
    };

    const updateLessonTitle = (moduleId, lessonId, title) => {
        setModules(modules.map(m =>
            m.id === moduleId
                ? {
                    ...m,
                    lessons: m.lessons.map(l =>
                        l.id === lessonId ? { ...l, title } : l
                    )
                }
                : m
        ));
    };

    const handleVideoUpload = (moduleId, lessonId, file) => {
        if (file && file.type.startsWith('video/')) {
            const videoUrl = URL.createObjectURL(file);
            setModules(modules.map(m =>
                m.id === moduleId
                    ? {
                        ...m,
                        lessons: m.lessons.map(l =>
                            l.id === lessonId ? { ...l, videoFile: file, videoUrl } : l
                        )
                    }
                    : m
            ));
        }
    };

    const removeVideo = (moduleId, lessonId) => {
        setModules(modules.map(m =>
            m.id === moduleId
                ? {
                    ...m,
                    lessons: m.lessons.map(l =>
                        l.id === lessonId ? { ...l, videoFile: null, videoUrl: null } : l
                    )
                }
                : m
        ));
    };

    return (
        <div className="add-course">
            <div className="add-course__header">
                <h1>Thêm khóa học mới</h1>
                <div className="add-course__header-actions">
                    <button type="button" className="btn btn-secondary">Làm mới</button>
                    <button form="add-course-form" className="btn btn-primary">Lưu khóa học</button>
                </div>
            </div>

            <form id="add-course-form" className="add-course__form">
                {/* Left column */}
                <div className="add-course__left">
                    <div className="form-group">
                        <label htmlFor="title">Tên khóa học</label>
                        <input id="title" className="form-control" placeholder="Nhập tên khóa học" />
                    </div>

                    <div className="grid-3">
                        <div className="form-group">
                            <label>Danh mục</label>
                            <select className="form-control">
                                <option disabled>Chọn danh mục</option>
                                <option value="category1">Danh mục 1</option>
                                <option value="category2">Danh mục 2</option>
                                <option value="category3">Danh mục 3</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Trình độ</label>
                            <select className="form-control">
                                <option value="basic">Cơ bản</option>
                                <option value="intermediate">Trung cấp</option>
                                <option value="advanced">Nâng cao</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Ngôn ngữ</label>
                            <select className="form-control">
                                <option value="vietnamese">Tiếng Việt</option>
                                <option value="english">Tiếng Anh</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Mô tả chi tiết</label>
                        <TextEditor />
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

                                                    {/* NÚT TẢI VIDEO + DẤU × BÊN PHẢI */}
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
                                                                    ×
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
                                                                    ×
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-ghost lesson__delete"
                                                                    onClick={() => removeLesson(module.id, lesson.id)}
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Preview video */}
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
                        <input className="form-control" placeholder="Tên giảng viên" />
                    </div>

                    <div className="form-group">
                        <label>Trạng thái</label>
                        <select className="form-control">
                            <option>Sắp khai giảng</option>
                            <option>Đang diễn ra</option>
                            <option>Hoàn thành</option>
                            <option>Đã hủy</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Ngày bắt đầu</label>
                        <input type="date" className="form-control" />
                    </div>

                    <div className="form-group">
                        <label>Ngày kết thúc</label>
                        <input type="date" className="form-control" />
                    </div>

                    <div className="form-group">
                        <label>Thời lượng (giờ)</label>
                        <input type="number" min="0" className="form-control" placeholder="0" />
                    </div>

                    <div className="panel">
                        <div className="panel__title">Ảnh đại diện</div>
                        <input type="file" accept="image/*" className="form-control" />
                        <img className="preview-image" src="https://via.placeholder.com/150" alt="preview" />
                    </div>

                    <div className="panel">
                        <div className="panel__title">Video giới thiệu</div>
                        <input type="file" accept="video/*" className="form-control" />
                        <video className="preview-video" src="#" controls style={{ width: '100%', marginTop: '8px' }} />
                    </div>

                    <div className="panel">
                        <div className="panel__title">Học phí</div>
                        <div className="grid-2">
                            <div className="form-group">
                                <label>Giá gốc (VNĐ)</label>
                                <input type="number" min="0" className="form-control" placeholder="0" />
                            </div>
                            <div className="form-group">
                                <label>Giảm giá (%)</label>
                                <input type="number" min="0" max="100" className="form-control" placeholder="0" />
                            </div>
                        </div>
                        <div className="final-price">
                            Giá sau giảm: <strong>0 VNĐ</strong>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CreateCourse;