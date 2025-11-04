import './layoutDefaultAdmin.scss';
import { IoHomeSharp } from "react-icons/io5";
import { MdCategory } from "react-icons/md";
import { FaNewspaper } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { FaRegListAlt } from "react-icons/fa";
import { MdAccountBox } from "react-icons/md";
function Sidebar() {
    const ADMIN_PATH = "/admin";
    return (
        <div className="sidebar">
            <div className="sidebar__container">
                <ul className="sidebar__menu">
                    <li className="sidebar__item--active">
                        <a href={ADMIN_PATH}>
                            <div className="icon"><IoHomeSharp /></div>
                            <span>Trang chủ</span>
                        </a></li>
                    <li className="sidebar__item">
                        <a href={ADMIN_PATH + '/courses'}>
                            <div className="icon"><FaRegListAlt /></div>
                            <span>Khóa học</span>
                        </a>
                    </li>
                    <li className="sidebar__item">
                        <a href={ADMIN_PATH + '/account'}>
                            <div className="icon"><MdAccountBox /></div>
                            <span>Tài khoản</span>
                        </a>
                    </li>
                    <li className="sidebar__item">
                        <a href={ADMIN_PATH + '/categories'}>
                            <div className="icon"><MdCategory /></div>
                            <span>Danh mục</span>
                        </a>
                    </li>
                    <li className="sidebar__item">
                        <a href={ADMIN_PATH + '/articles'}>
                            <div className="icon"><FaNewspaper /></div>
                            <span>Tin tức</span>
                        </a>
                    </li>
                    <li className="sidebar__item">
                        <a href="/logout">
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