import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./post.scss";
import articleService from "../../../services/client/articleService";

const Posts = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState(["Tất cả"]);
  const [selectedTag, setSelectedTag] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const postsPerPage = 4;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await articleService.getAllArticles();
        setArticles(data);

        const uniqueCategories = ["Tất cả"];
        const categorySet = new Set();

        data.forEach((article) => {
          if (article.category && article.category.title) {
            categorySet.add(article.category.title);
          }
        });

        uniqueCategories.push(...Array.from(categorySet));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Lỗi khi tải bài viết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles =
    selectedTag === "Tất cả"
      ? articles
      : articles.filter(
        (article) =>
          article.category && article.category.title === selectedTag
      );

  const totalPages = Math.ceil(filteredArticles.length / postsPerPage);

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = filteredArticles.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getAuthorName = (article) => {
    return article.createdBy?.account_id?.fullName || "Tác giả ẩn danh";
  };

  const formatDate = (date) => {
    if (!date) return "Không xác định";
    const postDate = new Date(date);
    const now = new Date();
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} tiếng trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return postDate.toLocaleDateString("vi-VN");
  };

  // ✅ Hàm loại bỏ HTML tags và lấy plain text
  const stripHtmlTags = (html) => {
    if (!html) return "";

    // Tạo một temporary div để parse HTML
    const temp = document.createElement("div");
    temp.innerHTML = html;

    // Lấy text content (không có HTML tags)
    return temp.textContent || temp.innerText || "";
  };

  // ✅ Hàm tạo excerpt (trích đoạn) từ nội dung
  const getExcerpt = (content, maxLength = 150) => {
    if (!content) return "Nội dung đang được cập nhật...";

    const plainText = stripHtmlTags(content);

    if (plainText.length <= maxLength) {
      return plainText;
    }

    return plainText.substring(0, maxLength).trim() + "...";
  };

  // ✅ Tính thời gian đọc dựa trên plain text
  const calculateReadingTime = (htmlContent) => {
    if (!htmlContent) return 1;

    const plainText = stripHtmlTags(htmlContent);
    const wordCount = plainText.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // 200 từ/phút

    return readingTime || 1;
  };

  if (loading) {
    return (
      <div className="posts-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="posts-container">
      {/* Bộ lọc chủ đề */}
      <div className="topic-filter">
        <h3>XEM CÁC BÀI VIẾT THEO CHỦ ĐỀ</h3>
        <div className="topic-buttons">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`topic-btn ${selectedTag === cat ? "active" : ""}`}
              onClick={() => {
                setSelectedTag(cat);
                setCurrentPage(1);
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách bài viết */}
      <div className="featured-posts">
        <h3>BÀI VIẾT NỔI BẬT</h3>
        <p>Tổng hợp các bài viết chia sẻ hữu ích, cập nhật liên tục.</p>

        <div className="post-list">
          {currentPosts.length > 0 ? (
            currentPosts.map((article) => (
              <div
                key={article._id}
                className="post-item"
                onClick={() => navigate(`/article/${article._id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="post-image">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/article-placeholder.png";
                    }}
                  />
                </div>

                <div className="post-info">
                  <div className="post-header">
                    <div>
                      <h4 className="author">{getAuthorName(article)}</h4>
                      <span className="time">
                        {formatDate(article.createdAt)}
                      </span>
                    </div>
                  </div>

                  <h2 className="post-title">{article.title}</h2>

                  {/* ✅ Hiển thị excerpt đã được strip HTML */}
                  <p className="post-desc">
                    {getExcerpt(article.content, 150)}
                  </p>

                  <div className="post-footer">
                    <span className="tag">
                      {article.category?.title || "Chưa phân loại"}
                    </span>
                    {/* ✅ Tính thời gian đọc chính xác từ plain text */}
                    <span className="read-time">
                      {calculateReadingTime(article.content)} phút đọc
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-articles">Chưa có bài viết nào</div>
          )}
        </div>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`page-btn ${currentPage === page ? "active" : ""}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;