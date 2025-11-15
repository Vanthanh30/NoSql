import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./post.scss";
import articleService from "../../../services/client/articleService";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const data = await articleService.getArticleById(id);
        setArticle(data);
      } catch (error) {
        console.error("Lỗi khi tải bài viết:", error);
        setError("Không thể tải bài viết");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

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

  const getAuthorName = () => {
    return article?.createdBy?.account_id?.fullName || "Tác giả ẩn danh";
  };

  if (loading) {
    return (
      <div className="post-detail-container">
        <div style={{ textAlign: "center", marginTop: 50 }}>
          Đang tải bài viết...
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="post-detail-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>
        <div style={{ textAlign: "center", marginTop: 50 }}>
          {error || "Bài viết không tồn tại."}
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <h1 className="post-title">{article.title}</h1>

      <div className="post-meta">
        <div>
          <h4>{getAuthorName()}</h4>
          <span>
            {formatDate(article.createdAt)} •
            {Math.ceil((article.content?.length || 0) / 300)} phút đọc
          </span>
        </div>
      </div>

      {article.image && (
        <img
          src={article.image || "/placeholder.svg"}
          alt={article.title}
          className="post-cover"
          onError={(e) => (e.target.src = "/images/article-placeholder.png")}
        />
      )}

      <div className="post-content">
        <p>{article.content}</p>
      </div>

      {article.category && (
        <div className="post-category">
          <span className="tag">{article.category.title}</span>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
