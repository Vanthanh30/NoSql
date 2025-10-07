import React, { useState } from "react";
import "./home_pages.scss";

const HomePage = () => {
    const [user, setUser] = useState({ name: "", email: "", age: "" });

    const handleChange = (e) =>
        setUser({ ...user, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`👤 Họ tên: ${user.name}\n📧 Email: ${user.email}\n🎂 Tuổi: ${user.age}`);
    };

    return (
        <div className="home">
            <form className="form" onSubmit={handleSubmit}>
                <h2>Nhập thông tin</h2>
                {["name", "email", "age"].map((field) => (
                    <div className="form-group" key={field}>
                        <label>{field === "name" ? "Họ và tên" : field === "email" ? "Email" : "Tuổi"}</label>
                        <input
                            type={field === "age" ? "number" : field === "email" ? "email" : "text"}
                            name={field}
                            value={user[field]}
                            onChange={handleChange}
                            placeholder={`Nhập ${field === "name" ? "họ tên" : field}`}
                            required
                            min={field === "age" ? 1 : undefined}
                        />
                    </div>
                ))}
                <button type="submit">Gửi</button>
            </form>
        </div>
    );
};

export default HomePage;
