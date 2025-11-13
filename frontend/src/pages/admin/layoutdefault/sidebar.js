import './layoutDefaultAdmin.scss';
import { IoHomeSharp } from "react-icons/io5";
import { MdCategory } from "react-icons/md";
import { FaNewspaper } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { FaRegListAlt } from "react-icons/fa";
import { MdAccountBox } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom"; // 🟢 THÊM DÒNG NÀY

function Sidebar() {
    const ADMIN_PATH = "/admin";
    const navigate = useNavigate();
    const location = useLocation(); // 🟢 THÊM DÒNG NÀY

    const handleLogout = () => {
        localStorage.removeItem("account");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/admin/login");
    };

    return (
        <div className="sidebar">
            <div className="sidebar__container">
                <ul className="sidebar__menu">
                    {/* 🟢 THÊM điều kiện active */}
                    <li className={location.pathname === ADMIN_PATH ? "sidebar__item--active" : "sidebar__item"}>
                        <a href={ADMIN_PATH}>
                            <div className="icon"><IoHomeSharp /></div>
                            <span>Trang chủ</span>
                        </a>
                    </li>

                    <li className={location.pathname === ADMIN_PATH + '/courses' ? "sidebar__item--active" : "sidebar__item"}>
                        <a href={ADMIN_PATH + '/courses'}>
                            <div className="icon"><FaRegListAlt /></div>
                            <span>Khóa học</span>
                        </a>
                    </li>

                    <li className={location.pathname === ADMIN_PATH + '/account' ? "sidebar__item--active" : "sidebar__item"}>
                        <a href={ADMIN_PATH + '/account'}>
                            <div className="icon"><MdAccountBox /></div>
                            <span>Tài khoản</span>
                        </a>
                    </li>

                    <li className={location.pathname === ADMIN_PATH + '/categories' ? "sidebar__item--active" : "sidebar__item"}>
                        <a href={ADMIN_PATH + '/categories'}>
                            <div className="icon"><MdCategory /></div>
                            <span>Danh mục</span>
                        </a>
                    </li>

                    <li className={location.pathname === ADMIN_PATH + '/articles' ? "sidebar__item--active" : "sidebar__item"}>
                        <a href={ADMIN_PATH + '/articles'}>
                            <div className="icon"><FaNewspaper /></div>
                            <span>Tin tức</span>
                        </a>
                    </li>

                    <li className="sidebar__item">
                        <a onClick={handleLogout} style={{ cursor: "pointer" }}>
                            <div className="icon"><IoLogOut /></div>
                            <span>Đăng xuất</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
