import { useState, useEffect } from "react";
import articleAPI from "../../../services/admin/articleService";
import { Link, useNavigate } from "react-router-dom";
import "./article.scss";

function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await articleAPI.getAll();

      let list = [];

      if (Array.isArray(res.data)) {
        list = res.data;
      } else if (res.data?.articles && Array.isArray(res.data.articles)) {
        list = res.data.articles;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        list = res.data.data;
      } else if (res.data && typeof res.data === "object") {
        list = [res.data];
      }

      console.log("Danh sách bài viết:", list);
      setArticles(list);
    } catch (err) {
      setError("Lỗi tải dữ liệu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/articles/edit/${id}`);
  };

  const handleCreate = () => {
    navigate("/admin/articles/create");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa bài viết này?")) return;
    try {
      await articleAPI.delete(id);
      fetchArticles();
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };
  if (loading) return <div className="articles">Đang tải...</div>;
  if (error)
    return (
      <div className="articles">
        <p>{error}</p>
        <button onClick={fetchArticles}>Thử lại</button>
      </div>
    );

  return (
    <div className="articles">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="articles__title">Danh sách bài viết</h1>

            <table className="articles__table">
              <thead>
                <tr>
                  <th>Số thứ tự</th>
                  <th>Tên bài viết</th>
                  <th>Danh mục</th>
                  <th>người tạo</th>
                  <th>Ngày đăng</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Chưa có bài viết
                    </td>
                  </tr>
                ) : (
                  articles.map((art, idx) => (
                    <tr key={art._id}>
                      <td>{idx + 1}</td>
                      <td>{art.title}</td>
                      <td>
                        {art.category && art.category.title
                          ? art.category.title
                          : "Chưa chọn / Lỗi ID"}
                      </td>
                      <td>
                        {art.createdBy?.name
                          ? art.createdBy.name
                          : art.createdBy?.account_id
                          ? `User_${art.createdBy.account_id.slice(-6)}`
                          : "Admin"}
                      </td>
                      <td>
                        {new Date(art.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            art.status === "active"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {art.status === "active" ? "Hoạt động" : "Ẩn"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn categories__btn-edit"
                          onClick={() => handleEdit(art._id)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn categories__btn-delete"
                          onClick={() => handleDelete(art._id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <button className="articles__btn-add" onClick={handleCreate}>
              Thêm bài viết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticlesPage;
