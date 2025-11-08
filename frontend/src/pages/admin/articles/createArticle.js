import "./article.scss";
import TextEditor from "../../../components/TinyMCE/index";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import articleAPI from "../../../services/admin/articleService";
import categoryAPI from "../../../services/admin/categoryService";
function CreateArticles() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState("https://via.placeholder.com/150");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    image: null,
    createdBy: {
      account_id: "672c9e90b8a2f4c04c4a13b2",
      createdAt: new Date(),
    },
  });
  useEffect(() => {
    categoryAPI
      .getAll()
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : res.data.categories || [];
        setCategories(list);
      })
      .catch(() => alert("Lỗi tải danh mục"));
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleEditorChange = (content) => {
    console.log("Nội dung từ TinyMCE:", content);
    setFormData((prev) => ({ ...prev, content }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const editorIframe = document.querySelector("iframe.tox-edit-area__iframe");
    let contentHTML = formData.content;

    if (editorIframe) {
      const innerDoc =
        editorIframe.contentDocument || editorIframe.contentWindow.document;
      contentHTML = innerDoc.body.innerHTML.trim();
    }

    if (!formData.title.trim()) return alert("Vui lòng nhập tiêu đề");
    if (!contentHTML || contentHTML === "<br>")
      return alert("Vui lòng nhập nội dung");

    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", contentHTML);
    data.append("category", formData.category);
    if (formData.image) data.append("image", formData.image);
    data.append("createdBy", JSON.stringify(formData.createdBy));

    try {
      await articleAPI.create(data);
      alert("Tạo bài viết thành công!");
      navigate("/admin/articles");
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || "Không thể tạo"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-article">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="article__title">Tạo bài viết mới</h1>
            <form className="article__form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Tiêu đề bài viết</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Nhập tiêu đề bài viết"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Danh mục</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
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
                <label>Ảnh(nếu có)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <div className="avatar-preview">
                  <img src={preview} alt="preview" />
                </div>
              </div>
              <div className="form-group">
                <label>Chi tiết bài viết</label>
                <TextEditor
                  value={formData.content}
                  onChange={handleEditorChange}
                />
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

export default CreateArticles;
