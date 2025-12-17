import "./course.scss";
import TextEditor from "../../../components/TinyMCE/index";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import courseAPI from "../../../services/admin/courseService";
import lessonAPI from "../../../services/admin/lessonService";
import chapterAPI from "../../../services/admin/chapterService";
import categoryAPI from "../../../services/admin/categoryService";
import userService from "../../../services/admin/userService";

function CreateCourse() {
  const [modules, setModules] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [courseInfo, setCourseInfo] = useState({
    title: "",
    category: "",
    level: "basic",
    language: "vietnamese",
    teacher: "",
    status: "Hoạt động",
    startDate: "",
    endDate: "",
    duration: 0,
    price: 0,
    discount: 0,
    thumbnail: null,
    introVideo: null,
    description: "",
  });
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryAPI.getAll();
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error(err);
        alert("Không thể tải danh mục!");
      }
    };
    fetchCategories();
  }, []);
  // --- Module / Lesson logic ---
  const addModule = () => {
    const newModule = {
      id: Date.now(),
      title: `Chương ${modules.length + 1}`,
      lessons: [],
    };
    setModules([...modules, newModule]);
  };
  const removeModule = (moduleId) =>
    setModules(modules.filter((m) => m.id !== moduleId));
  const updateModuleTitle = (moduleId, title) =>
    setModules(modules.map((m) => (m.id === moduleId ? { ...m, title } : m)));
  const addLesson = (moduleId) => {
    const newLesson = {
      id: Date.now(),
      title: `bài học ${
        modules.find((m) => m.id === moduleId).lessons.length + 1
      }`,
      videoFile: null,
      videoUrl: null,
    };
    setModules(
      modules.map((m) =>
        m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
      )
    );
  };
  const removeLesson = (moduleId, lessonId) =>
    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
          : m
      )
    );
  const updateLessonTitle = (moduleId, lessonId, title) =>
    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lessonId ? { ...l, title } : l
              ),
            }
          : m
      )
    );
  const handleVideoUpload = (moduleId, lessonId, file) => {
    if (file && file.type.startsWith("video/")) {
      const videoUrl = URL.createObjectURL(file);
      setModules(
        modules.map((m) =>
          m.id === moduleId
            ? {
                ...m,
                lessons: m.lessons.map((l) =>
                  l.id === lessonId ? { ...l, videoFile: file, videoUrl } : l
                ),
              }
            : m
        )
      );
    }
  };
  const handleDescriptionChange = (content) => {
    setCourseInfo((prev) => ({ ...prev, description: content }));
  };
  const removeVideo = (moduleId, lessonId) =>
    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lessonId
                  ? { ...l, videoFile: null, videoUrl: null }
                  : l
              ),
            }
          : m
      )
    );

  // --- Input change handler ---
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setCourseInfo({ ...courseInfo, [name]: files[0] });
    } else {
      if (name === "price" || name === "discount" || name === "duration") {
        const numericValue = value === "" ? 0 : Number(value);
        setCourseInfo({ ...courseInfo, [name]: numericValue });
      } else {
        setCourseInfo({ ...courseInfo, [name]: value });
      }
    }
  };

  // --- Submit form ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const chaptersData = [];

      // 1️⃣ Tạo từng lesson và upload video, rồi tạo chapter
      for (const module of modules) {
        const lessonIds = [];
        for (const lesson of module.lessons) {
          // Nếu muốn, có thể gọi lessonAPI.create riêng
          // hoặc backend không cần tạo lesson riêng, tùy nhu cầu
          if (lesson.videoFile) {
            const lessonForm = new FormData();
            lessonForm.append("title", lesson.title);
            lessonForm.append("videoUrl", lesson.videoFile);
            const resLesson = await lessonAPI.create(lessonForm);
            lessonIds.push(resLesson.data.lesson._id);
          } else {
            // Nếu không có video, vẫn tạo lesson
            const resLesson = await lessonAPI.create({ title: lesson.title });
            lessonIds.push(resLesson.data.lesson._id);
          }
        }

        // Tạo chapter với các lessonId
        const chapterRes = await chapterAPI.create({
          title: module.title,
          lessons: lessonIds,
        });
        chaptersData.push(chapterRes.data.chapter._id);
      }

      // 2️⃣ Tạo FormData cho khóa học
      const formData = new FormData();
      formData.append("title", courseInfo.title);
      formData.append("category", courseInfo.category);
      formData.append("level", courseInfo.level);
      formData.append("language", courseInfo.language);
      formData.append("instructor", courseInfo.teacher); // sửa từ instruc
      formData.append("status", courseInfo.status);

      // Gửi object time và pricing dưới dạng JSON string
      formData.append(
        "time",
        JSON.stringify({
          startDate: courseInfo.startDate,
          endDate: courseInfo.endDate,
          durationHours: courseInfo.duration,
        })
      );
      formData.append(
        "pricing",
        JSON.stringify({
          price: courseInfo.price,
          discount: courseInfo.discount,
        })
      );

      formData.append("description", courseInfo.description);

      // chapters: mảng ID
      formData.append("chapters", JSON.stringify(chaptersData));

      // Media files
      if (courseInfo.thumbnail)
        formData.append("imageUrl", courseInfo.thumbnail);
      if (courseInfo.introVideo)
        formData.append("videoUrl", courseInfo.introVideo);

      const token = userService.getToken();
      if (token) {
        const decoded = jwtDecode(token);
        const userId = decoded.id || decoded._id; // tùy payload token
        if (userId) {
          formData.append("createBy", userId);
        }
      }
      // Gọi API tạo course
      const courseRes = await courseAPI.create(formData);
      alert("Tạo khóa học thành công!");
      console.log(courseRes.data);
      navigate("/admin/courses");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Tạo khóa học thất bại, kiểm tra console log!");
    }
  };

  return (
    <div className="add-course">
      <div className="add-course__header">
        <h1>Thêm khóa học mới</h1>
        <div className="add-course__header-actions">
          <button type="button" className="btn btn-secondary">
            Làm mới
          </button>
          <button onClick={handleSubmit} className="btn btn-primary">
            Lưu khóa học
          </button>
        </div>
      </div>

      <form id="add-course-form" className="add-course__form">
        {/* Left column */}
        <div className="add-course__left">
          <div className="form-group">
            <label htmlFor="title">Tên khóa học</label>
            <input
              id="title"
              name="title"
              value={courseInfo.title}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Nhập tên khóa học"
            />
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label>Danh mục</label>
              <select
                name="category"
                className="form-control"
                onChange={handleInputChange}
                value={courseInfo.category}
              >
                <option value="">Chọn danh mục</option>
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
                name="level"
                className="form-control"
                onChange={handleInputChange}
                value={courseInfo.level}
              >
                <option value="basic">Cơ bản</option>
                <option value="intermediate">Trung cấp</option>
                <option value="advanced">Nâng cao</option>
              </select>
            </div>
            <div className="form-group">
              <label>Ngôn ngữ</label>
              <select
                name="language"
                className="form-control"
                onChange={handleInputChange}
                value={courseInfo.language}
              >
                <option value="vietnamese">Tiếng Việt</option>
                <option value="english">Tiếng Anh</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Mô tả chi tiết</label>
            <TextEditor
              value={courseInfo.description}
              onChange={handleDescriptionChange}
            />
          </div>

          {/* Modules */}
          <div className="panel">
            <div className="panel__title">Nội dung khóa học</div>
            <div className="modules">
              {modules.map((module) => (
                <div key={module.id} className="module">
                  <div className="module__header">
                    <input
                      className="form-control"
                      value={module.title}
                      onChange={(e) =>
                        updateModuleTitle(module.id, e.target.value)
                      }
                      placeholder="Tên chương"
                    />
                    <div className="module__actions">
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => addLesson(module.id)}
                      >
                        + Bài học
                      </button>
                      {modules.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => removeModule(module.id)}
                        >
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
                            onChange={(e) =>
                              updateLessonTitle(
                                module.id,
                                lesson.id,
                                e.target.value
                              )
                            }
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
                                    onChange={(e) =>
                                      handleVideoUpload(
                                        module.id,
                                        lesson.id,
                                        e.target.files[0]
                                      )
                                    }
                                  />
                                </label>
                                <button
                                  type="button"
                                  className="btn btn-ghost lesson__delete"
                                  onClick={() =>
                                    removeLesson(module.id, lesson.id)
                                  }
                                >
                                  ×
                                </button>
                              </>
                            ) : (
                              <div className="lesson__video-info">
                                <span className="video-name">
                                  {lesson.videoFile.name}
                                </span>
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-sm"
                                  onClick={() =>
                                    removeVideo(module.id, lesson.id)
                                  }
                                >
                                  ×
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-ghost lesson__delete"
                                  onClick={() =>
                                    removeLesson(module.id, lesson.id)
                                  }
                                >
                                  ×
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        {lesson.videoFile && (
                          <div className="lesson__preview">
                            <video
                              src={lesson.videoUrl}
                              controls
                              className="video-thumb"
                            />
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
              <button
                type="button"
                className="btn btn-outline"
                onClick={addModule}
              >
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
              name="teacher"
              className="form-control"
              onChange={handleInputChange}
              placeholder="Tên giảng viên"
            />
          </div>
          <div className="form-group">
            <label>Trạng thái</label>
            <select
              name="status"
              className="form-control"
              onChange={handleInputChange}
            >
              <option>Hoạt động</option>
              <option>Không hoạt động</option>
            </select>
          </div>
          <div className="form-group">
            <label>Ngày bắt đầu</label>
            <input
              name="startDate"
              type="date"
              className="form-control"
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Ngày kết thúc</label>
            <input
              name="endDate"
              type="date"
              className="form-control"
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Thời lượng (giờ)</label>
            <input
              name="duration"
              type="number"
              min="0"
              className="form-control"
              onChange={handleInputChange}
            />
          </div>

          <div className="panel">
            <div className="panel__title">Ảnh đại diện</div>
            <input
              type="file"
              accept="image/*"
              name="thumbnail"
              className="form-control"
              onChange={handleInputChange}
            />
            {courseInfo.thumbnail && (
              <img
                className="preview-image"
                src={URL.createObjectURL(courseInfo.thumbnail)}
                alt="preview"
              />
            )}
          </div>

          <div className="panel">
            <div className="panel__title">Video giới thiệu</div>
            <input
              type="file"
              accept="video/*"
              name="introVideo"
              className="form-control"
              onChange={handleInputChange}
            />
            {courseInfo.introVideo && (
              <video
                className="preview-video"
                src={URL.createObjectURL(courseInfo.introVideo)}
                controls
                style={{ width: "100%", marginTop: "8px" }}
              />
            )}
          </div>

          <div className="panel">
            <div className="panel__title">Học phí</div>
            <div className="grid-2">
              <div className="form-group">
                <label>Giá gốc (VNĐ)</label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  className="form-control"
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Giảm giá (%)</label>
                <input
                  name="discount"
                  type="number"
                  min="0"
                  max="100"
                  className="form-control"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="final-price">
              Giá sau giảm:{" "}
              <strong>
                {courseInfo.price -
                  (courseInfo.price * courseInfo.discount) / 100}{" "}
                VNĐ
              </strong>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateCourse;
