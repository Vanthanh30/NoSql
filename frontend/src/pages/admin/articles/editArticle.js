import "./article.scss";
import TextEditor from "../../../components/TinyMCE";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import articleAPI from "../../../services/admin/articleService";
import categoryAPI from "../../../services/admin/categoryService";

function EditArticles() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [articleData, setArticleData] = useState({
    title: "",
    category: "",
    content: "",
    image: "",
  });

  const [categories, setCategories] = useState([]);
  const [newImageFile, setNewImageFile] = useState(null);

  const previewImage = newImageFile
    ? URL.createObjectURL(newImageFile)
    : articleData.image || "https://via.placeholder.com/150";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [categoryRes, articleRes] = await Promise.all([
          categoryAPI.getAll(),
          articleAPI.getById(id),
        ]);

        const catList = Array.isArray(categoryRes.data)
          ? categoryRes.data
          : categoryRes.data.categories || categoryRes.data.data || [];
        setCategories(catList);

        const data = articleRes.data;
        setArticleData({
          title: data.title || "",
          category: data.category?._id || data.category || "",
          content: data.content || "",
          image: data.image
            ? data.image.startsWith("http")
              ? data.image
              : `http://localhost:3000/${data.image}`
            : "https://via.placeholder.com/150",
        });

        setIsDataLoaded(true);
      } catch (error) {
        console.error(" Lỗi tải dữ liệu:", error);
        alert("Không thể tải thông tin bài viết.");
        navigate("/admin/articles");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  useEffect(() => {
    return () => {
      if (newImageFile) {
        URL.revokeObjectURL(newImageFile);
      }
    };
  }, [newImageFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setArticleData((prev) => ({ ...prev, content }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setNewImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!articleData.title.trim()) return alert("Vui lòng nhập tiêu đề!");
    if (!articleData.content.trim() || articleData.content === "<br>")
      return alert("Vui lòng nhập nội dung!");

    setLoading(true);
    const formData = new FormData();
    formData.append("title", articleData.title);
    formData.append("content", articleData.content);
    formData.append("category", articleData.category);
    formData.append("account_id", "current_user_account_id");

    if (newImageFile) formData.append("image", newImageFile);

    try {
      await articleAPI.update(id, formData);
      alert(" Cập nhật bài viết thành công!");
      navigate("/admin/articles");
    } catch (error) {
      console.error(" Lỗi cập nhật:", error);
      alert("Lỗi: " + (error.response?.data?.error || "Không thể cập nhật."));
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isDataLoaded) {
    return <div className="loading-spinner">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="create-article">
      <div className="container">
        <h1 className="create-article__title">Chỉnh sửa bài viết</h1>

        <form className="create-article__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Tiêu đề bài viết</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Nhập tiêu đề bài viết"
              value={articleData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Danh mục</label>
            <select
              id="category"
              name="category"
              value={articleData.category}
              onChange={handleChange}
              required
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
            <label>Ảnh minh họa (chọn ảnh mới để thay thế)</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <div className="avatar-preview">
              <img src={previewImage} alt="preview" />
              {!newImageFile && articleData.image && <p>Ảnh hiện tại</p>}
            </div>
          </div>

          <div className="form-group">
            <label>Nội dung bài viết</label>
            {isDataLoaded ? (
              <TextEditor
                key={id}
                value={articleData.content}
                onChange={handleEditorChange}
              />
            ) : (
              <div>Đang tải nội dung...</div>
            )}
          </div>

          <div className="btn-actions">
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu bài viết"}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/admin/articles")}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditArticles;
