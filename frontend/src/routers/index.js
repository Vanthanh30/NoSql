import React from "react";
import { useRoutes } from "react-router-dom";

// Layout mặc định
import LayoutDefault from "../page/client/layoutdefault";

// Trang chủ
import HomePage from "../page/client/home_pages";

// 👉 Export riêng routes để có thể import { routes } ở file khác
export const routes = [
    {
        path: "/",
        element: <LayoutDefault />, // Dùng layout mặc định
        children: [
            {
                index: true, // "/" → Trang mặc định
                element: <HomePage />, // Hiển thị nội dung home_pages
            },
        ],
    },
];

// 👉 Export mặc định AppRouter
const AppRouter = () => {
    return useRoutes(routes);
};

export default AppRouter;
