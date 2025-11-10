import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../../../services/admin/courseService';
import chapterService from '../../../services/admin/chapterService';
import lessonService from '../../../services/admin/lessonService';
import TextEditor from '../../../components/TinyMCE/index';
import categoryAPI from '../../../services/admin/categoryService';
import './course.scss';

function EditCourse() {
    const { id } = useParams();
    const navigate = useNavigate();

    // --- STATE FORM ---
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [level, setLevel] = useState('');
    const [language, setLanguage] = useState('');
    const [instructor, setInstructor] = useState('');
    const [status, setStatus] = useState('Sắp khai giảng');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [duration, setDuration] = useState(0);
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [description, setDescription] = useState('');
    const [chapters, setChapters] = useState([]);
    const [categories, setCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [lessonVideoFiles, setLessonVideoFiles] = useState({}); // { [lessonId]: File }

    const finalPrice = Math.round(price * (1 - discount / 100));

    const formRef = useRef(null);

    // --- LOAD COURSE ---
    useEffect(() => {
        loadCategories(); // gọi thêm API danh mục
        if (!id) return;
        loadCourse();
    }, [id]);

    const loadCategories = async () => {
        try {
            const { data } = await categoryAPI.getAll();
            setCategories(data.categories || []);
        } catch (err) {
            console.error('Lỗi tải danh mục:', err);
            alert('Không tải được danh mục');
        }
    };
    const loadCourse = async () => {
        try {
            const { data } = await courseService.getById(id);

            setTitle(data.title || '');
            setCategory(data.category || '');
            setLevel(data.level || '');
            setLanguage(data.language || '');
            setInstructor(data.instructor || '');
            setStatus(data.status || 'Sắp khai giảng');
            setStartDate(data.time?.startDate ? data.time.startDate.split('T')[0] : '');
            setEndDate(data.time?.endDate ? data.time.endDate.split('T')[0] : '');
            setDuration(data.time?.durationHours || 0);
            setPrice(data.pricing?.price || 0);
            setDiscount(data.pricing?.discount || 0);
            setDescription(data.description || '');

            const originalChapters = data.chapters || [];

            if (originalChapters.length > 0) {
                const chaptersWithLessons = await Promise.all(
                    originalChapters.map(async (ch) => {
                        const chapterId = ch._id || ch.$oid || ch;

                        try {
                            const { data: chapterDetail } = await chapterService.getById(chapterId);

                            const lessonsDetailed = await Promise.all(
                                (chapterDetail.lessons || []).map(async (lesson) => {
                                    const lessonId = lesson._id || lesson.$oid || lesson;
                                    try {
                                        const { data: lessonDetail } = await lessonService.getById(lessonId);
                                        return {
                                            ...lessonDetail,
                                            videoUrl: lessonDetail.videoUrl || '',
                                        };
                                    } catch {
                                        return lesson;
                                    }
                                })
                            );

                            return { ...chapterDetail, lessons: lessonsDetailed };
                        } catch {
                            return typeof ch === 'object' ? ch : { _id: ch };
                        }
                    })
                );

                setChapters(chaptersWithLessons);
            } else {
                setChapters([]);
            }

            if (formRef.current) {
                const img = formRef.current.querySelector('.preview-image');
                if (img) img.src = data.media?.imageUrl || 'https://via.placeholder.com/150';

                const video = formRef.current.querySelector('.preview-video');
                if (video) {
                    if (data.media?.videoUrl) {
                        video.src = data.media.videoUrl;
                        video.style.display = 'block';
                    } else {
                        video.src = '#';
                        video.style.display = 'none';
                    }
                }
            }
        } catch (err) {
            alert('Không tải được khóa học');
            console.error(err);
        }
    };

    const updateCourseField = async (field, value) => {
        try {
            const formData = new FormData();
            formData.append('data', JSON.stringify({ [field]: value }));
            await courseService.update(id, formData);
        } catch (err) {
            console.error(`Cập nhật khóa học thất bại ở trường ${field}:`, err);
        }
    };

    const updateCourseTime = async (newTime) => {
        try {
            const formData = new FormData();
            formData.append('data', JSON.stringify({ time: newTime }));
            await courseService.update(id, formData);
        } catch (err) {
            console.error('Cập nhật thời gian khóa học thất bại:', err);
        }
    };

    const updateCoursePricing = async (newPricing) => {
        try {
            const formData = new FormData();
            formData.append('data', JSON.stringify({ pricing: newPricing }));
            await courseService.update(id, formData);
        } catch (err) {
            console.error('Cập nhật học phí khóa học thất bại:', err);
        }
    };

    // --- XỬ LÝ PREVIEW ẢNH VÀ VIDEO KHI CHỌN FILE MỚI ---
    useEffect(() => {
        if (!formRef.current) return;

        const img = formRef.current.querySelector('.preview-image');
        if (imageFile && img) {
            const url = URL.createObjectURL(imageFile);
            img.src = url;
            return () => URL.revokeObjectURL(url);
        }
    }, [imageFile]);

    useEffect(() => {
        if (!formRef.current) return;

        const video = formRef.current.querySelector('.preview-video');
        if (videoFile && video) {
            const url = URL.createObjectURL(videoFile);
            video.src = url;
            video.style.display = 'block';
            return () => URL.revokeObjectURL(url);
        } else if (video) {
            video.src = '#';
            video.style.display = 'none';
        }
    }, [videoFile]);

    // --- LESSON VIDEO HANDLERS ---
    const handleLessonVideoChange = (chIdx, lesIdx, file) => {
        if (!file) return;

        const lesson = chapters[chIdx]?.lessons?.[lesIdx];
        const lessonId = lesson?._id || lesson?.id;

        if (!lessonId) {
            alert('Bài học này chưa có ID trong CSDL. Hãy bấm "Lưu khóa học" trước khi tải video.');
            console.error('Không có lessonId khi chọn video:', lesson);
            return;
        }

        setLessonVideoFiles(prev => ({
            ...prev,
            [lessonId]: file
        }));

        const url = URL.createObjectURL(file);
        setChapters(prev => {
            const copy = [...prev];
            copy[chIdx].lessons[lesIdx].previewUrl = url;
            return copy;
        });
    };

    const removeLessonVideo = (chIdx, lesIdx) => {
        const lessonId = chapters[chIdx].lessons[lesIdx]._id;
        setLessonVideoFiles(prev => {
            const newFiles = { ...prev };
            delete newFiles[lessonId];
            return newFiles;
        });

        setChapters(prev => {
            const copy = [...prev];
            delete copy[chIdx].lessons[lesIdx].previewUrl;
            return copy;
        });
    };

    useEffect(() => {
        return () => {
            chapters.forEach(ch => {
                ch.lessons?.forEach(les => {
                    if (les.previewUrl) URL.revokeObjectURL(les.previewUrl);
                });
            });
        };
    }, [chapters]);

    // --- SUBMIT FORM (ĐÃ CẬP NHẬT ĐẦY ĐỦ) ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const account_id = user?._id || 'unknown';

        const payload = new FormData();
        const formData = {
            title,
            category,
            level,
            language,
            instructor,
            status,
            time: { startDate, endDate, durationHours: duration },
            pricing: { price, discount },
            description,
            updatedBy: { account_id }
        };

        payload.append('data', JSON.stringify(formData));
        if (imageFile) payload.append('imageUrl', imageFile);
        if (videoFile) payload.append('videoUrl', videoFile);

        try {
            // Cập nhật thông tin, ảnh, video khóa học
            await courseService.update(id, payload);
            console.log('Đã cập nhật khóa học');

            // Cập nhật video cho các bài học (nếu có)
            for (const [lessonId, file] of Object.entries(lessonVideoFiles)) {
                const videoForm = new FormData();
                videoForm.append('videoUrl', file);
                await lessonService.uploadVideo(lessonId, videoForm);
                console.log(`Cập nhật video cho bài học ${lessonId}`);
            }

            alert('Lưu thành công!');
            await loadCourse();
            setLessonVideoFiles({});
            navigate('/admin/courses');
        } catch (err) {
            console.error('Lỗi khi lưu:', err);
            alert('Lỗi: ' + (err.response?.data?.error || err.message));
        }
    };

    // --- CHAPTER & LESSON ---
    const addChapter = async () => {
        try {
            const newChapter = await chapterService.create({ title: 'Chương mới', courseId: id });
            setChapters(prev => [...prev, { ...newChapter, lessons: [] }]);
        } catch (err) {
            alert('Thêm chương thất bại');
            console.error(err);
        }
    };

    const addLesson = async (chapterId) => {
        try {
            const formData = new FormData();
            formData.append("title", "Bài học 1");
            formData.append("chapterId", chapterId);

            const { data } = await lessonService.create(formData);

            setChapters((prev) =>
                prev.map((ch) =>
                    ch._id === chapterId
                        ? { ...ch, lessons: [...(ch.lessons || []), data.lesson] }
                        : ch
                )
            );
        } catch (err) {
            console.error("Lỗi khi thêm bài học:", err);
        }
    };

    const updateChapter = async (idx, title) => {
        const ch = chapters[idx];
        if (ch._id) {
            await chapterService.update(ch._id, { title });
            setChapters(prev => {
                const copy = [...prev];
                copy[idx].title = title;
                return copy;
            });
        }
    };

    const deleteChapter = async (idx) => {
        if (!window.confirm('Xóa chương này?')) return;
        const ch = chapters[idx];
        if (ch._id) await chapterService.delete(ch._id);
        setChapters(prev => prev.filter((_, i) => i !== idx));
    };

    const updateLesson = async (chIdx, lesIdx, title) => {
        const lesson = chapters[chIdx].lessons[lesIdx];
        if (lesson._id) {
            await lessonService.update(lesson._id, { title });
            setChapters(prev => {
                const copy = [...prev];
                copy[chIdx].lessons[lesIdx].title = title;
                return copy;
            });
        }
    };

    const deleteLesson = async (chIdx, lesIdx) => {
        if (!window.confirm('Xóa bài học này?')) return;
        const lesson = chapters[chIdx].lessons[lesIdx];
        if (lesson._id) await lessonService.delete(lesson._id);
        setChapters(prev => {
            const copy = [...prev];
            copy[chIdx].lessons.splice(lesIdx, 1);
            return copy;
        });
    };

    // --- RENDER ---
    if (!title && !description) return <div className="text-center">Đang tải...</div>;

    return (
        <div className="add-course">
            <div className="add-course__header">
                <h1>Chỉnh sửa khóa học</h1>
                <div className="add-course__header-actions">
                    <button type="button" className="btn btn-secondary" onClick={loadCourse}>Làm mới</button>
                    <button form="add-course-form" type="submit" className="btn btn-primary">Lưu khóa học</button>
                </div>
            </div>

            <form ref={formRef} id="add-course-form" className="add-course__form" onSubmit={handleSubmit}>
                {/* Left */}
                <div className="add-course__left">
                    <div className="form-group">
                        <label>Tên khóa học</label>
                        <input
                            className="form-control"
                            value={title}
                            onChange={e => {
                                setTitle(e.target.value);
                                updateCourseField('title', e.target.value);
                            }}
                        />
                    </div>

                    <div className="grid-3">
                        <div className="form-group">
                            <label>Danh mục</label>
                            <select
                                className="form-control"
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    updateCourseField('category', e.target.value);
                                }}
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Trình độ</label>
                            <select
                                className="form-control"
                                value={level}
                                onChange={e => {
                                    setLevel(e.target.value);
                                    updateCourseField('level', e.target.value);
                                }}
                            >
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
                                onChange={e => {
                                    setLanguage(e.target.value);
                                    updateCourseField('language', e.target.value);
                                }}
                            >
                                <option value="vietnamese">Tiếng Việt</option>
                                <option value="english">Tiếng Anh</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Mô tả chi tiết</label>
                        <TextEditor
                            value={description}
                            onChange={val => {
                                setDescription(val);
                                updateCourseField('description', val);
                            }}
                        />
                    </div>

                    <div className="panel">
                        <div className="panel__title">Nội dung khóa học</div>
                        <div className="modules">
                            {chapters.map((ch, i) => (
                                <div key={ch._id} className="module">
                                    <div className="module__header">
                                        <input
                                            className="form-control"
                                            value={ch.title}
                                            onChange={(e) => updateChapter(i, e.target.value)}
                                            placeholder="Tên chương"
                                        />
                                        <div className="module__actions">
                                            <button
                                                type="button"
                                                className="btn btn-light"
                                                onClick={() => addLesson(ch._id)}
                                            >
                                                + Bài học
                                            </button>
                                            {chapters.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => deleteChapter(i)}
                                                >
                                                    Xóa chương
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="lessons">
                                        {ch.lessons?.map((les, j) => (
                                            <div key={les._id} className="lesson">
                                                <div className="lesson__wrapper">
                                                    <input
                                                        className="form-control lesson__title"
                                                        value={les.title}
                                                        onChange={(e) => updateLesson(i, j, e.target.value)}
                                                        placeholder="Tên bài học"
                                                    />
                                                    <div className="lesson__right-actions">
                                                        {!lessonVideoFiles[les._id] ? (
                                                            <>
                                                                <label className="lesson__upload-btn">
                                                                    {les.videoUrl ? 'Thay video' : 'Tải video'}
                                                                    <input
                                                                        type="file"
                                                                        accept="video/*"
                                                                        onChange={(e) =>
                                                                            handleLessonVideoChange(i, j, e.target.files[0])
                                                                        }
                                                                    />
                                                                </label>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-ghost lesson__delete"
                                                                    onClick={() => deleteLesson(i, j)}
                                                                >
                                                                    ×
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <div className="lesson__video-info">
                                                                <span className="video-name">
                                                                    {lessonVideoFiles[les._id].name}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-ghost btn-sm"
                                                                    onClick={() => removeLessonVideo(i, j)}
                                                                >
                                                                    ×
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-ghost lesson__delete"
                                                                    onClick={() => deleteLesson(i, j)}
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Hiển thị video preview */}
                                                {(les.videoUrl || les.previewUrl) && (
                                                    <div className="lesson__preview">
                                                        <video
                                                            src={les.previewUrl || les.videoUrl}
                                                            controls
                                                            className="video-thumb"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {(!ch.lessons || ch.lessons.length === 0) && (
                                            <div className="muted">Chưa có bài học</div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <button type="button" className="btn btn-outline" onClick={addChapter}>
                                + Thêm chương
                            </button>
                        </div>
                    </div>
                </div>
                {/* Right */}
                <div className="add-course__right">
                    <div className="form-group">
                        <label>Giảng viên</label>
                        <input
                            className="form-control"
                            value={instructor}
                            onChange={e => {
                                setInstructor(e.target.value);
                                updateCourseField('instructor', e.target.value);
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Trạng thái</label>
                        <select
                            className="form-control"
                            value={status}
                            onChange={e => {
                                setStatus(e.target.value);
                                updateCourseField('status', e.target.value);
                            }}
                        >
                            <option>Sắp khai giảng</option>
                            <option>Đang diễn ra</option>
                            <option>Hoàn thành</option>
                            <option>Đã hủy</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Ngày bắt đầu</label>
                        <input
                            type="date"
                            className="form-control"
                            value={startDate}
                            onChange={e => {
                                setStartDate(e.target.value);
                                updateCourseTime({
                                    startDate: e.target.value,
                                    endDate,
                                    durationHours: duration
                                });
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Ngày kết thúc</label>
                        <input
                            type="date"
                            className="form-control"
                            value={endDate}
                            onChange={e => {
                                setEndDate(e.target.value);
                                updateCourseTime({
                                    startDate,
                                    endDate: e.target.value,
                                    durationHours: duration
                                });
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Thời lượng (giờ)</label>
                        <input
                            type="number"
                            min="0"
                            className="form-control"
                            value={duration}
                            onChange={e => {
                                const val = Number(e.target.value);
                                setDuration(val);
                                updateCourseTime({
                                    startDate,
                                    endDate,
                                    durationHours: val
                                });
                            }}
                        />
                    </div>

                    <div className="panel">
                        <div className="panel__title">Ảnh đại diện</div>
                        <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            onChange={e => setImageFile(e.target.files[0])}
                        />
                        <img className="preview-image" src="https://via.placeholder.com/150" alt="preview" />
                    </div>

                    <div className="panel">
                        <div className="panel__title">Video giới thiệu</div>
                        <input
                            type="file"
                            accept="video/*"
                            className="form-control"
                            onChange={e => setVideoFile(e.target.files[0])}
                        />
                        <video className="preview-video" src="#" controls style={{ display: 'none' }} />
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
                                    onChange={e => {
                                        const val = Number(e.target.value);
                                        setPrice(val);
                                        updateCoursePricing({
                                            price: val,
                                            discount
                                        });
                                    }}
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
                                    onChange={e => {
                                        const val = Number(e.target.value);
                                        setDiscount(val);
                                        updateCoursePricing({
                                            price,
                                            discount: val
                                        });
                                    }}
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