import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TextEditor from "../../../components/TinyMCE";
import categoryAPI from "../../../services/admin/categoryService";
import "./categories.scss";

function EditCategories() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    parentId: "",
    status: "active",
    position: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, allRes] = await Promise.all([
          categoryAPI.getById(id),
          categoryAPI.getAll(),
        ]);
        const current = catRes.data.category;
        setFormData({
          title: current.title || "",
          description: current.description || "",
          parentId: current.parentId || "",
          status: current.status || "active",
          position: current.position || 0,
        });
        setCategories(allRes.data.categories.filter((c) => c._id !== id));
      } catch (err) {
        alert("Không tìm thấy danh mục");
        navigate("/admin/categories");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (content) => {
    setFormData({ ...formData, description: content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert("Vui lòng nhập tên");

    setSaving(true);
    try {
      await categoryAPI.update(id, formData);
      alert("Cập nhật thành công!");
      navigate("/admin/categories");
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || "Không thể cập nhật"));
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="categories-page">
        <h1>Đang tải...</h1>
      </div>
    );

  return (
    <div className="categories-page">
      <h1>Chỉnh sửa danh mục</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên danh mục *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
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
            onEditorChange={handleEditorChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={saving}>
            {saving ? "Đang lưu..." : "Cập nhật"}
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

export default EditCategories;
