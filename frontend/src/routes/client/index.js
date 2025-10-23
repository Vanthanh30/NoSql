import React from "react";
import { useRoutes } from "react-router-dom";
import LayoutDefault from "../../pages/client/layoutdefault";
import HomePage from "../../pages/client/home";

export const routes = [
    {
        path: "/",
        element: <LayoutDefault />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
        ],
    },
];
