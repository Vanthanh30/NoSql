import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./header";
import "./layoutdefault.scss";

const LayoutHeaderOnly = () => {
  return (
    <div className="layout-header-only">
      <Header />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutHeaderOnly;
