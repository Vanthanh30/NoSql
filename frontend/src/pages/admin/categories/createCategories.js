import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextEditor from "../../../components/TinyMCE";
import categoryAPI from "../../../services/admin/categoryService";
import "./categories.scss";

function CreateCategories() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    parentId: "",
    status: "active",
    position: 0,
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryAPI
      .getAll()
      .then((res) => setCategories(res.data.categories))
      .catch(() => alert("Lỗi tải danh mục cha"));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (content) => {
    setFormData({ ...formData, description: content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert("Vui lòng nhập tên danh mục");

    setLoading(true);
    try {
      await categoryAPI.create(formData);
      alert("Tạo danh mục thành công!");
      navigate("/admin/categories");
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || "Không thể tạo"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="categories-page">
      <h1>Thêm mới danh mục</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên danh mục *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Nhập tên danh mục"
            required
          />
        </div>

        <div className="form-group">
          <label>Danh mục cha</label>
          <select
            name="parentId"
            value={formData.parentId}
            onChange={handleChange}
          >
            <option value="">-- Không chọn --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Trạng thái</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Hoạt động</option>
            <option value="inactive">Ngừng hoạt động</option>
          </select>
        </div>

        <div className="form-group">
          <label>Mô tả</label>
          <TextEditor
            value={formData.description}
            onChange={handleEditorChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="btn-cancel"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCategories;