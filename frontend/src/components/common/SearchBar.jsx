import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import accountService from "../../services/admin/accountService";
import courseAPI from "../../services/admin/courseService";
import articleAPI from "../../services/admin/articleService";
import categoryAPI from "../../services/admin/categoryService";
import { FaSearch } from "react-icons/fa";

const SERVICE_MAP = {
  account: async (keyword) => {
    const accounts = await accountService.getAccounts();
    return accounts
      .filter(
        (acc) =>
          acc.fullName?.toLowerCase().includes(keyword.toLowerCase()) ||
          (acc._id || acc.id) === keyword
      )
      .map((acc) => ({ ...acc, _type: "account" }));
  },
  course: async (keyword) => {
    const res = await courseAPI.getAll();
    const courses = Array.isArray(res)
      ? res
      : res.data?.courses || res.data || [];
    return courses
      .filter(
        (course) =>
          course.title?.toLowerCase().includes(keyword.toLowerCase()) ||
          (course._id || course.id) === keyword
      )
      .map((course) => ({ ...course, _type: "course" }));
  },
  article: async (keyword) => {
    const res = await articleAPI.getAll();
    const articles = Array.isArray(res)
      ? res
      : res.data?.articles || res.data || [];
    return articles
      .filter(
        (article) =>
          article.title?.toLowerCase().includes(keyword.toLowerCase()) ||
          (article._id || article.id) === keyword
      )
      .map((article) => ({ ...article, _type: "article" }));
  },
  category: async (keyword) => {
    const res = await categoryAPI.getAll();
    const categories = Array.isArray(res)
      ? res
      : res.data?.categories || res.data || [];
    return categories
      .filter(
        (cat) =>
          cat.title?.toLowerCase().includes(keyword.toLowerCase()) ||
          (cat._id || cat.id) === keyword
      )
      .map((cat) => ({ ...cat, _type: "category" }));
  },
};

const TYPE_ROUTE_MAP = {
  account: "account",
  course: "courses",
  article: "articles",
  category: "categories",
};

function SearchBar({ types = ["account", "course", "article", "category"] }) {
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKey.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const promises = types.map((t) => SERVICE_MAP[t](searchKey.trim()));
      const resArrays = await Promise.all(promises);
      const combined = resArrays.flat();

      if (!combined.length) setError("Không tìm thấy kết quả!");
      setResults(combined);
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra!");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClickResult = (item) => {
    const typePath = TYPE_ROUTE_MAP[item._type];
    if (!typePath) return;
    navigate(`/admin/${typePath}/edit/${item._id || item.id}`);
    setResults([]);
    setSearchKey("");
  };

  return (
    <div className="search-bar" style={{ position: "relative" }}>
      <form onSubmit={handleSearch} className="search-bar__form">
        <input
          type="text"
          placeholder="Tìm kiếm account, course, article hoặc category theo tên/ID"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          <FaSearch />
        </button>
      </form>

      {error && <p className="search-bar__error">{error}</p>}

      {results.length > 0 && (
        <ul
          className="search-bar__dropdown"
          style={{
            position: "absolute",
            top: "45px",
            left: 0,
            width: "100%",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "6px",
            maxHeight: "250px",
            overflowY: "auto",
            zIndex: 999,
          }}
        >
          {results.map((item) => (
            <li
              key={item._id || item.id}
              style={{
                padding: "8px 10px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
              }}
              onClick={() => handleClickResult(item)}
            >
              <span>
                {item._type === "account"
                  ? item.fullName
                  : item._type === "course"
                  ? item.title
                  : item._type === "article"
                  ? item.title
                  : item._type === "category"
                  ? item.title
                  : item.name}
              </span>
              <span style={{ fontStyle: "italic", color: "#888" }}>
                [{item._type}]
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
