import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./post.scss";
import articleService from "../../../services/client/articleService";
import DOMPurify from "dompurify";

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

  // Hàm sanitize HTML để bảo mật
  const createMarkup = (htmlContent) => {
    if (!htmlContent) return { __html: "" };

    // Sử dụng DOMPurify để loại bỏ các script độc hại
    const cleanHTML = DOMPurify.sanitize(htmlContent, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'code', 'pre', 'table',
        'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span', 'hr'
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'style', 'target']
    });

    return { __html: cleanHTML };
  };

  // Tính thời gian đọc dựa trên độ dài nội dung HTML
  const calculateReadingTime = (htmlContent) => {
    if (!htmlContent) return 1;
    // Loại bỏ HTML tags để đếm từ
    const plainText = htmlContent.replace(/<[^>]*>/g, '');
    const wordCount = plainText.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Giả sử đọc 200 từ/phút
    return readingTime || 1;
  };

  if (loading) {
    return (
      <div className="post-detail-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải bài viết...</p>
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
        <div className="error-message">
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
            {formatDate(article.createdAt)} • {calculateReadingTime(article.content)} phút đọc
          </span>
        </div>
      </div>

      {article.image && (
        <img
          src={article.image}
          alt={article.title}
          className="post-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/article-placeholder.png";
          }}
        />
      )}

      <div
        className="post-content"
        dangerouslySetInnerHTML={createMarkup(article.content)}
      />

      {article.category && (
        <div className="post-category">
          <span className="tag">{article.category.title}</span>
        </div>
      )}
    </div>
  );
};

export default PostDetail;