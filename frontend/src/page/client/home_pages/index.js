import React, { useState, useEffect } from "react";
import axios from "axios";
import "./home_pages.scss";

const HomePage = () => {
  const [user, setUser] = useState({ name: "", email: "", age: "" });
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users");
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users: " + err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const response = await axios.put(
          `http://localhost:3000/api/users/${editingUser._id}`,
          user
        );
        alert(`User updated successfully: ${response.data.name}`);
        setEditingUser(null);
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/users",
          user
        );
        alert(`User created successfully: ${response.data.name}`);
      }
      setUser({ name: "", email: "", age: "" });
      fetchUsers();
      setError(null);
    } catch (err) {
      setError(
        "Failed to save user: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const handleEdit = (u) => {
    setEditingUser(u);
    setUser({ name: u.name, email: u.email, age: u.age || "" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      try {
        await axios.delete(`http://localhost:3000/api/users/${id}`);
        alert("Xóa người dùng thành công");
        fetchUsers();
        setError(null);
      } catch (err) {
        setError(
          "Failed to delete user: " +
            (err.response?.data?.message || err.message)
        );
      }
    }
  };

  return (
    <div className="home">
      <h2>Quản lý người dùng</h2>
      {error && <p className="error">{error}</p>}

      {/* Form nhập thông tin */}
      <form className="form" onSubmit={handleSubmit}>
        <h3>{editingUser ? "Cập nhật người dùng" : "Thêm người dùng"}</h3>
        {["name", "email", "age"].map((field) => (
          <div className="form-group" key={field}>
            <label>
              {field === "name"
                ? "Họ và tên"
                : field === "email"
                ? "Email"
                : "Tuổi"}
            </label>
            <input
              type={
                field === "age"
                  ? "number"
                  : field === "email"
                  ? "email"
                  : "text"
              }
              name={field}
              value={user[field]}
              onChange={handleChange}
              placeholder={`Nhập ${field === "name" ? "họ tên" : field}`}
              required
              min={field === "age" ? 1 : undefined}
            />
          </div>
        ))}
        <button type="submit">{editingUser ? "Cập nhật" : "Gửi"}</button>
        {editingUser && (
          <button
            type="button"
            onClick={() => {
              setEditingUser(null);
              setUser({ name: "", email: "", age: "" });
            }}
          >
            Hủy
          </button>
        )}
      </form>

      {/* Danh sách users */}
      <div className="user-list">
        <h3>Danh sách người dùng</h3>
        {users.length === 0 ? (
          <p>Chưa có người dùng nào</p>
        ) : (
          <ul>
            {users.map((u) => (
              <li key={u._id}>
                {u.name} ({u.email}, {u.age || "N/A"} tuổi)
                <button onClick={() => handleEdit(u)}>Sửa</button>
                <button onClick={() => handleDelete(u._id)}>Xóa</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HomePage;
