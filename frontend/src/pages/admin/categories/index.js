import "./categories.scss";
import categoryAPI from "../../../services/admin/categoryService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoryAPI.getAll();
      setCategories(response.data.categories);
    } catch (err) {
      console.error("Lỗi lấy categories:", err);
      setError("Không thể tải danh sách categories");
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/admin/categories/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
      try {
        await categoryAPI.delete(id);
        window.location.reload();
      } catch (err) {
        alert("Lỗi khi xóa!");
      }
    }
  };

  if (loading) {
    return (
      <div className="categories">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="categories__title">Đang tải...</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="categories">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="categories__title">Lỗi</h1>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={fetchCategories}>
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="categories">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="categories__title">Danh sách khóa học</h1>

            <table className="categories__table">
              <thead>
                <tr>
                  <th>Số thứ tự</th>
                  <th>Tên danh mục</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colPan="4" className="text-center">
                      Không có danh mục nào
                    </td>
                  </tr>
                ) : (
                  categories.map((category, index) => (
                    <tr key={categories._id}>
                      <td>{index + 1}</td>
                      <td>{category.title}</td>
                      <td>
                        <span
                          className={`badge ${
                            category.status === "active"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {category.status === "active"
                            ? "Hoạt động"
                            : "Không hoạt động"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn categories__btn-edit"
                          onClick={() => handleEdit(category._id)}
                        >
                          {" "}
                          Sửa
                        </button>
                        <button
                          className="btn categories__btn-delete"
                          onClick={() => handleDelete(category._id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <button className="categories__btn-add">
              <a href="/admin/categories/create">Thêm danh mục</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;
