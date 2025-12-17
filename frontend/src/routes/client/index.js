import React from "react";
import LayoutDefault from "../../pages/client/layoutdefault";
import HomePage from "../../pages/client/home";
import Login from "../../pages/client/auth/login";
import ForgotPassword from "../../pages/client/auth/forgot_password";
import Register from "../../pages/client/auth/register";
import Posts from "../../pages/client/posts";
import CoursePage from "../../pages/client/course";
import PostDetail from "../../pages/client/posts/postdetail.js";
import LearningPage from "../../pages/client/course/learning.js";
import Profile from "../../pages/client/auth/profile.js";

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
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/profile",
    element: <LayoutDefault />,
    children: [
      {
        index: true,
        element: <Profile />,
      },
    ],
  },
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "course/:id",
        element: <CoursePage />,
      },
      {
        path: "learn/:id",
        element: <LearningPage />,
      },
    ],
  },
  {
    path: "/posts",
    element: <LayoutDefault />,
    children: [
      {
        index: true,
        element: <Posts />,
      },
    ],
  },
  {
    path: "/article/:id",
    element: <LayoutDefault />,
    children: [
      {
        index: ":id",
        element: <PostDetail />,
      },
    ],
  },
];
