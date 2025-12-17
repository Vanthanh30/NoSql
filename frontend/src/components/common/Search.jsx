import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiBook, FiFileText } from "react-icons/fi";
import courseService from "../../services/client/courseService";
import articleService from "../../services/client/articleService";
import "./Search.scss";

const Search = () => {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    courses: [],
    articles: [],
  });
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchAPI = async (query) => {
    try {
      setIsSearching(true);

      const [coursesData, articlesData] = await Promise.all([
        courseService.getAllCourses(),
        articleService.getAllArticles(),
      ]);

      const searchTerm = query.toLowerCase().trim();

      const filteredCourses = coursesData.filter(
        (course) =>
          course.title?.toLowerCase().includes(searchTerm) ||
          course.instructor?.toLowerCase().includes(searchTerm) ||
          course.description?.toLowerCase().includes(searchTerm)
      );

      const filteredArticles = articlesData.filter(
        (article) =>
          article.title?.toLowerCase().includes(searchTerm) ||
          article.author?.toLowerCase().includes(searchTerm) ||
          article.content?.toLowerCase().includes(searchTerm)
      );

      return {
        courses: filteredCourses.slice(0, 5),
        articles: filteredArticles.slice(0, 5),
      };
    } catch (error) {
      console.error("Search error:", error);
      return { courses: [], articles: [] };
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        const results = await searchAPI(searchQuery);
        setSearchResults(results);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSearchItemClick = (type, id) => {
    setShowSearchResults(false);
    setSearchQuery("");

    if (type === "course") {
      navigate(`/course/${id}`);
    } else if (type === "article") {
      navigate(`/article/${id}`);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const highlightText = (text, query) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <strong key={index} className="highlight">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  return (
    <div className="search-bar" ref={searchRef}>
      <div className="search-input-wrapper">
        <FiSearch className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Tìm kiếm khóa học, bài viết..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
        />
        {isSearching && (
          <div className="search-loading">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      {showSearchResults && searchQuery.length >= 2 && (
        <div className="search-results-dropdown">
          {searchResults.courses && searchResults.courses.length > 0 && (
            <div className="search-section">
              <div className="search-section-title">
                <FiBook size={16} />
                <span>Khóa học</span>
              </div>
              {searchResults.courses.map((course) => (
                <div
                  key={course._id || course.id}
                  className="search-result-item"
                  onClick={() =>
                    handleSearchItemClick("course", course._id || course.id)
                  }
                >
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="result-thumbnail"
                    />
                  )}
                  <div className="result-content">
                    <div className="result-title">
                      {highlightText(course.title, searchQuery)}
                    </div>
                    {course.instructor && (
                      <div className="result-meta">
                        Giảng viên: {course.instructor}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchResults.articles && searchResults.articles.length > 0 && (
            <div className="search-section">
              <div className="search-section-title">
                <FiFileText size={16} />
                <span>Bài viết</span>
              </div>
              {searchResults.articles.map((article) => (
                <div
                  key={article._id || article.id}
                  className="search-result-item"
                  onClick={() =>
                    handleSearchItemClick("article", article._id || article.id)
                  }
                >
                  {article.thumbnail && (
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="result-thumbnail"
                    />
                  )}
                  <div className="result-content">
                    <div className="result-title">
                      {highlightText(article.title, searchQuery)}
                    </div>
                    {article.author && (
                      <div className="result-meta">
                        Tác giả: {article.author}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isSearching &&
            (!searchResults.courses || searchResults.courses.length === 0) &&
            (!searchResults.articles ||
              searchResults.articles.length === 0) && (
              <div className="search-no-results">
                <p>Không tìm thấy kết quả cho "{searchQuery}"</p>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default Search;
