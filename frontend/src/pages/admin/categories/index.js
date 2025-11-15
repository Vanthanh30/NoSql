import "./categories.scss";
import categoryAPI from "../../../services/admin/categoryService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../components/common/Pagination";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // THÊM PHÂN TRANG
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/admin/categories/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;

    try {
      await categoryAPI.delete(id);
      await fetchCategories();

      // Giảm trang nếu trang hiện tại bị trống
      const newTotal = Math.ceil((categories.length - 1) / itemsPerPage);
      if (currentPage > newTotal && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      alert("Lỗi khi xóa!");
    }
  };

  // PHÂN TRANG GIỐNG HỆT ACCOUNT
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCategories = categories.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="categories">
        <div className="container">
          <h1 className="categories__title">Đang tải...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="categories">
        <div className="container">
          <h1 className="categories__title">Lỗi</h1>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchCategories}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="categories">
      <div className="container">
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
            {currentCategories.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">
                  Không có danh mục nào
                </td>
              </tr>
            ) : (
              currentCategories.map((category, index) => (
                <tr key={category._id}>
                  <td>{startIndex + index + 1}</td>
                  <td>{category.title}</td>
                  <td>
                    <span
                      className={`badge ${category.status === "active" ? "bg-success" : "bg-danger"
                        }`}
                    >
                      {category.status === "active" ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn categories__btn-edit"
                      onClick={() => handleEdit(category._id)}
                    >
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

        {/* 👉 GỌI PHÂN TRANG Y CHANG ACCOUNT */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* NÚT THÊM */}
        <button className="categories__btn-add">
          <a href="/admin/categories/create">Thêm danh mục</a>
        </button>
      </div>
    </div>
  );
}

export default CategoriesPage;
