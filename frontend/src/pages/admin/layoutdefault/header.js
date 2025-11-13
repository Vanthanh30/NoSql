import './layoutDefaultAdmin.scss';
import React from 'react';
import logo from "../../../assets/images/logo.png";
import SearchBar from "../../../components/common/SearchBar";

function Header() {
    let account = null;
    try {
        account = JSON.parse(localStorage.getItem("account"));
    } catch (err) {
        console.warn("localStorage account parsing error", err);
    }

    const userName = account?.fullName || "Admin";
    const userAvatar = account?.avatar || null;

    return (
        <header className="header">
            <div className="header__container-fluid">
                <div className='row align-items-center d-flex'>
                    {/* Logo Section */}
                    <div className='col-md-3'>
                        <div className='logo'>
                            <a href="/"><img src={logo} alt="Logo" /></a>
                            <span>Learn1</span>
                        </div>
                    </div>

                    {/* Search */}
                    <div className='col-md-6'>
                        <div className='search'>
                            <SearchBar types={["account", "course", "article", "category"]} />
                        </div>
                    </div>

                    {/* User Info */}
                    <div className='col-md-3 d-flex justify-content-end align-items-center'>
                        <div className="infor">
                            <div className={`infor__img ${!userAvatar ? "placeholder" : ""}`}>
                                {userAvatar && <img src={userAvatar} alt={userName} />}
                            </div>
                            <span className="infor__name">{userName}</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
