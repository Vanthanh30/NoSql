import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import "./layoutdefault.scss";

const LayoutDefault = () => {
    return (
        <div className="layout-default">
            <Header />
            <main className="ld-main">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default LayoutDefault;
