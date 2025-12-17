import React, { useState, useEffect } from "react";
import logo from "../../../assets/images/logo.png";
import SearchBar from "../../../components/common/SearchBar";
import accountService from "../../../services/admin/accountService";

function Header() {
  const [userName, setUserName] = useState("Admin");
  const [userAvatar, setUserAvatar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const accounts = await accountService.getAccounts();

        if (accounts.length > 0) {
          const currentUser = accounts[0];
          setUserName(currentUser.fullName || "Admin");
          setUserAvatar(currentUser.avatar || null);
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <header className="header">
        <div className="header__container-fluid">
          <div className="row align-items-center d-flex">
            <div className="col-md-3">
              <div className="logo">
                <a href="/">
                  <img src={logo} alt="Logo" />
                </a>
                <span>Learn1</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="search">
                <SearchBar
                  types={["account", "course", "article", "category"]}
                />
              </div>
            </div>
            <div className="col-md-3 d-flex justify-content-end align-items-center">
              <div className="infor">
                <div className="infor__img placeholder"></div>
                <span className="infor__name">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="header__container-fluid">
        <div className="row align-items-center d-flex">
          <div className="col-md-3">
            <div className="logo">
              <a href="/">
                <img src={logo} alt="Logo" />
              </a>
              <span>Learn1</span>
            </div>
          </div>
          <div className="col-md-6">
            <div className="search">
              <SearchBar types={["account", "course", "article", "category"]} />
            </div>
          </div>
          <div className="col-md-3 d-flex justify-content-end align-items-center">
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
