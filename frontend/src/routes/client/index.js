import React from "react";
import { useRoutes } from "react-router-dom";
import LayoutDefault from "../../pages/client/layoutdefault";
import HomePage from "../../pages/client/home";
import ShoppingCart from "../../pages/client/cart/ShoppingCart";

export const routes = [
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/cart",
        element: <ShoppingCart />,
      },
    ],
  },
];
