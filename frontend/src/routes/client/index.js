import React from "react";
import LayoutDefault from "../../pages/client/layoutdefault";
import HomePage from "../../pages/client/home";
import Login from "../../pages/client/auth/login";
import Register from "../../pages/client/auth/register";
import Posts from "../../pages/client/posts";
import PostDetail from "../../pages/client/posts/postdetail.js";

export const routes = [
    {
        path: "/register",
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
    {
        path: "/",
        element: <LayoutDefault />,
        children: [
            {
                index: true,
                element: <Posts />,
            },
        ],
    },
    {
        path: "/post/:id",
        element: <LayoutDefault />,
        children: [
            {
                index: true,
                element: <PostDetail />,
            },
        ],
    },
];
