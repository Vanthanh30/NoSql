import "./article.scss";
import TextEditor from "../../../components/TinyMCE/index";
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
    : articleData.image;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAll();

        const list = Array.isArray(response.data)
          ? response.data
          : response.data.categories || response.data.data || [];

        setCategories(list);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
        alert("Lỗi tải danh mục");
        setCategories([]);
      }
    };

    const fetchArticle = async () => {
      setIsDataLoaded(false);
      setLoading(true);
      try {
        const response = await articleAPI.getById(id);
        const data = response.data;

        setArticleData({
          title: data.title || "",
          category: data.category?._id || data.category || "",
          content: data.content || "",
          image: data.image
            ? `http://localhost:3000/${data.image}`
            : "https://via.placeholder.com/150",
        });
        setNewImageFile(null);
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Lỗi tải bài viết:", error);
        alert("Không thể tải thông tin bài viết.");
        navigate("/admin/articles");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchArticle();
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
    setArticleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditorChange = (content) => {
    setArticleData((prev) => ({
      ...prev,
      content: content,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (
      !articleData.title.trim() ||
      !articleData.content.trim() ||
      articleData.content.trim() === "<br>"
    ) {
      setLoading(false);
      return alert("Vui lòng điền đầy đủ Tiêu đề và Nội dung.");
    }

    const formData = new FormData();
    formData.append("title", articleData.title);
    formData.append("content", articleData.content);
    formData.append("category", articleData.category);
    formData.append("account_id", "current_user_account_id"); // Cần thay thế

    if (newImageFile) {
      formData.append("image", newImageFile);
    }

    try {
      await articleAPI.update(id, formData);
      alert("Cập nhật bài viết thành công!");
      navigate("/admin/articles");
    } catch (error) {
      console.error("Lỗi cập nhật bài viết:", error);
      alert(`Lỗi: ${error.response?.data?.error || error.message}`);
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
        <div className="row">
          <div className="col-12">
            <h1 className="article__title">Chỉnh sửa bài viết</h1>
            <form className="article__form" onSubmit={handleSubmit}>
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
                  <option value="">Chọn danh mục</option>
                  {Array.isArray(categories) &&
                    categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.title}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group">
                <label>Ảnh(Chọn ảnh mới để thay thế)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <div className="avatar-preview">
                  <img src={previewImage} alt="preview" />
                  {articleData.image && !newImageFile && <p>Ảnh hiện tại</p>}
                </div>
              </div>
              <div className="form-group">
                <label>Chi tiết bài viết</label>
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditArticles;
