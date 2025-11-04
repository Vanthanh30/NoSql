
import './layoutDefaultAdmin.scss';
import { FaSearch } from "react-icons/fa";
import React, { useState } from 'react';
import logo from "../../../assets/images/logo.png"; // Logo chính
// const languages = [
//     {
//         code: 'vn',
//         name: 'Tiếng Việt',
//         flag: 'https://flagcdn.com/w40/vn.png',
//     },
//     {
//         code: 'us',
//         name: 'English',
//         flag: 'https://flagcdn.com/w40/us.png',
//     },
// ];


function Header() {
    // const [selected, setSelected] = useState(languages[0]);
    const [open, setOpen] = useState(false);
    const storeUser = JSON.parse(localStorage.getItem("user"));
    const userName = storeUser ? storeUser.fullName : "Admin";
    const userAvatar = storeUser ? storeUser.avatar : "https://i.pravatar.cc/100";

    // const handleSelect = (lang) => {
    //     // setSelected(lang);
    //     setOpen(false);
    // };
    return (
        <>
            <header className="header">
                <div className="header__container-fluid">
                    <div className='row align-items-center d-flex '>
                        {/* Logo Section */}
                        <div className='col-md-3'>
                            <div className='logo'>
                                <a href="/">
                                    <img src={logo} alt="Logo" />
                                </a>
                                <span>Learn1</span>
                            </div>
                        </div>
                        {/* search*/}
                        <div className='col-md-6'>
                            <div className='search'>
                                <form className='search__form'>
                                    <input type="text" placeholder="Tìm kiếm khóa học" />
                                    <button type="submit"><FaSearch className="search-icon" /></button>
                                </form>
                            </div>
                        </div>
                        {/* User Section */}
                        <div className='col-md-3 d-flex justify-content-end align-items-center '>
                            {/* <div className='language-selector'>
                                <div className='language-selected' onClick={() => setOpen(!open)}>
                                    <img src={selected.flag} alt={selected.name} />
                                    <span>{selected.name}</span>
                                </div>
                                {open && (
                                    <ul className='language-dropdown'>
                                        {languages.map((lang) => (
                                            <li key={lang.code} onClick={() => handleSelect(lang)}>
                                                <img src={lang.flag} alt={lang.name} />
                                                <span>{lang.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div> */}
                            <div class="infor">
                                <div class="infor__img">
                                    <img src="https://i.pravatar.cc/100" alt="User Avatar" />
                                </div>
                                <span class="infor__name">admin</span>
                            </div>
                        </div>
                    </div>
                </div>

            </header>

        </>
    );
}
export default Header;