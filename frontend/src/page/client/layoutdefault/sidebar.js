import React from "react";

const Sidebar = () => {
    return (
        <aside className="layout-sidebar">
            <ul>
                <li><a href="/">Dashboard</a></li>
                <li><a href="/users">Users</a></li>
                <li><a href="/settings">Settings</a></li>
            </ul>
        </aside>
    );
};

export default Sidebar;
