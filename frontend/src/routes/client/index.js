import React from "react";
import { useRoutes } from "react-router-dom";
import LayoutDefault from "../../pages/client/layoutdefault";
import HomePage from "../../pages/client/home";
import Login from "../../pages/client/auth/login";
import Register from "../../pages/client/auth/register";

export const routes = [
    {
        path: "/",
        element: <Register />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/home",
        element: <LayoutDefault />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
        ],
    },
];
