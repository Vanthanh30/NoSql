import React from "react";
import { useRoutes } from "react-router-dom";
import LayoutDefault from "../../pages/client/layoutdefault";
import HomePage from "../../pages/client/home";
import ShoppingCart from "../../pages/client/cart/ShoppingCart";
import Checkout from "../../pages/client/checkout/Checkout";
import OrderConfirmation from "../../pages/client/confirm/OrderConfirmation";

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
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/confirm",
        element: <OrderConfirmation />,
      },
    ],
  },
];
