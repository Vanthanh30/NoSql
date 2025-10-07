import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./header";
import Sidebar from "./sidebar";
import Footer from "./footer";
import "./layoutDefault.scss";

const LayoutDefault = () => {
    return (
        <div className="layout-default">
            <Header />
            <div className="layout-body">
                <Sidebar />
                <main className="layout-main">
                    <Outlet />
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default LayoutDefault;
