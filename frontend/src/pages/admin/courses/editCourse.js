import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../../../services/admin/courseService';
import chapterService from '../../../services/admin/chapterService';
import lessonService from '../../../services/admin/lessonService';
import TextEditor from '../../../components/TinyMCE/index';
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
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);

    const finalPrice = Math.round(price * (1 - discount / 100));

    const formRef = useRef(null);

    // --- LOAD COURSE ---
    useEffect(() => {
        if (!id) return;
        loadCourse();
    }, [id]);

    const loadCourse = async () => {
        try {
            const data = await courseService.getCourseById(id);

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
            setChapters(data.chapters || []);

            if (formRef.current) {
                const img = formRef.current.querySelector('.preview-image');
                if (img) img.src = data.media?.imageUrl || 'https://via.placeholder.com/150';

                const video = formRef.current.querySelector('.preview-video');
                if (video) {
                    video.src = data.media?.videoUrl || '#';
                    video.style.display = data.media?.videoUrl ? 'block' : 'none';
                }
            }

        } catch (err) {
            alert('Không tải được khóa học');
            console.error(err);
        }
    };

    // --- SUBMIT FORM ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = new FormData();
        payload.append('data', JSON.stringify({
            title,
            category,
            level,
            language,
            instructor,
            status,
            time: { startDate, endDate, durationHours: duration },
            pricing: { price, discount },
            description
        }));
        if (imageFile) payload.append('imageUrl', imageFile);
        if (videoFile) payload.append('videoUrl', videoFile);

        try {
            await courseService.updateCourse(id, payload);
            alert('Lưu thành công!');
            await loadCourse();
            navigate('/admin/courses');
        } catch (err) {
            alert('Lỗi: ' + (err.response?.data?.error || err.message));
        }
    };

    // --- CHAPTER & LESSON ---
    const addChapter = async () => {
        try {
            const newChapter = await chapterService.createChapter({ title: 'Chương mới', courseId: id });

            setChapters(prev => [...prev, { ...newChapter, lessons: [] }]);
        } catch (err) {
            alert('Thêm chương thất bại');
            console.error(err);
        }
    };

    const addLesson = async (chapterId) => {
        try {
            // Gọi API tạo bài học
            const newLesson = await lessonService.createLesson('Bài học mới', chapterId);

            // Cập nhật state ngay
            setChapters(prev =>
                prev.map(ch =>
                    ch._id === chapterId
                        ? { ...ch, lessons: [...(ch.lessons || []), newLesson] }
                        : ch
                )
            );
        } catch (err) {
            alert('Thêm bài học thất bại: ' + (err.response?.data?.error || err.message));
            console.error(err);
        }
    };

    const updateChapter = async (idx, title) => {
        const ch = chapters[idx];
        if (ch._id) {
            await chapterService.updateChapter(ch._id, { title });

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
        if (ch._id) await chapterService.deleteChapter(ch._id);

        setChapters(prev => prev.filter((_, i) => i !== idx));
    };

    const updateLesson = async (chIdx, lesIdx, title) => {
        const lesson = chapters[chIdx].lessons[lesIdx];
        if (lesson._id) {
            await lessonService.updateLesson(lesson._id, { title });

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
        if (lesson._id) await lessonService.deleteLesson(lesson._id);

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
                        <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>

                    <div className="grid-3">
                        <div className="form-group">
                            <label>Danh mục</label>
                            <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                                <option value="">Chọn danh mục</option>
                                <option value="Lập trình">Lập trình</option>
                                <option value="Thiết kế">Thiết kế</option>
                                <option value="Marketing">Marketing</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Trình độ</label>
                            <select className="form-control" value={level} onChange={e => setLevel(e.target.value)}>
                                <option value="basic">Cơ bản</option>
                                <option value="intermediate">Trung cấp</option>
                                <option value="advanced">Nâng cao</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Ngôn ngữ</label>
                            <select className="form-control" value={language} onChange={e => setLanguage(e.target.value)}>
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
                            {chapters.map((ch, i) => (
                                <div key={ch._id} className="module">
                                    <div className="module__header">
                                        <input className="form-control" value={ch.title} onChange={e => updateChapter(i, e.target.value)} />
                                        <div className="module__actions">
                                            <button type="button" className="btn btn-light" onClick={() => addLesson(ch._id)}>+ Bài học</button>
                                            <button type="button" className="btn btn-danger" onClick={() => deleteChapter(i)}>Xóa chương</button>
                                        </div>
                                    </div>

                                    <div className="lessons">
                                        {ch.lessons?.map((les, j) => (
                                            <div key={les._id} className="lesson">
                                                <input className="form-control" value={les.title} onChange={e => updateLesson(i, j, e.target.value)} />
                                                <button type="button" className="btn btn-ghost" onClick={() => deleteLesson(i, j)}>X</button>
                                            </div>
                                        ))}
                                        {!ch.lessons?.length && <div className="muted">Chưa có bài học</div>}
                                    </div>
                                </div>
                            ))}

                            <button type="button" className="btn btn-outline" onClick={addChapter}>+ Thêm chương</button>
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div className="add-course__right">
                    <div className="form-group">
                        <label>Giảng viên</label>
                        <input className="form-control" value={instructor} onChange={e => setInstructor(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Trạng thái</label>
                        <select className="form-control" value={status} onChange={e => setStatus(e.target.value)}>
                            <option>Sắp khai giảng</option>
                            <option>Đang diễn ra</option>
                            <option>Hoàn thành</option>
                            <option>Đã hủy</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Ngày bắt đầu</label>
                        <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Ngày kết thúc</label>
                        <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Thời lượng (giờ)</label>
                        <input type="number" min="0" className="form-control" value={duration} onChange={e => setDuration(Number(e.target.value))} />
                    </div>

                    <div className="panel">
                        <div className="panel__title">Ảnh đại diện</div>
                        <input type="file" accept="image/*" className="form-control" onChange={e => setImageFile(e.target.files[0])} />
                        <img className="preview-image" src="https://via.placeholder.com/150" alt="preview" />
                    </div>

                    <div className="panel">
                        <div className="panel__title">Video giới thiệu</div>
                        <input type="file" accept="video/*" className="form-control" onChange={e => setVideoFile(e.target.files[0])} />
                        <video className="preview-video" src="#" controls style={{ display: 'none' }} />
                    </div>

                    <div className="panel">
                        <div className="panel__title">Học phí</div>
                        <div className="grid-2">
                            <div className="form-group">
                                <label>Giá gốc (VNĐ)</label>
                                <input type="number" min="0" className="form-control" value={price} onChange={e => setPrice(Number(e.target.value))} />
                            </div>
                            <div className="form-group">
                                <label>Giảm giá (%)</label>
                                <input type="number" min="0" max="100" className="form-control" value={discount} onChange={e => setDiscount(Number(e.target.value))} />
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
