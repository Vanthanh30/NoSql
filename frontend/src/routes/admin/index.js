import AdminLayout from "../../pages/admin/layoutdefault";
import Dashboard from "../../pages/admin/dashboard";
import Account from "../../pages/admin/accounts/index";
import AddUser from "../../pages/admin/accounts/createAccount";
import EditAccount from "../../pages/admin/accounts/editAccount";
import CategoriesPage from "../../pages/admin/categories/index";
import CreateCategories from "../../pages/admin/categories/createCategories";
import EditCategories from "../../pages/admin/categories/editCategories";
import CoursesPage from "../../pages/admin/courses/index";
import CreateCourse from "../../pages/admin/courses/createCourse";
import EditCourse from "../../pages/admin/courses/editCourse";
import Login from "../../pages/admin/auths/index";
import ArticlesPage from "../../pages/admin/articles/index";
import CreateArticles from "../../pages/admin/articles/createArticle";
import EditArticles from "../../pages/admin/articles/editArticle";
import AdminPrivateRoute from "../../components/AdminPrivateRoute";

export const adminRoute = [
  {
    path: "/admin",
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        element: <AdminPrivateRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                index: true,
                element: <Dashboard />,
              },
              {
                path: "account",
                element: <Account />,
              },
              {
                path: "account/create",
                element: <AddUser />,
              },
              {
                path: "account/edit/:id",
                element: <EditAccount />,
              },
              {
                path: "categories",
                element: <CategoriesPage />,
              },
              {
                path: "categories/create",
                element: <CreateCategories />,
              },
              {
                path: "categories/edit/:id",
                element: <EditCategories />,
              },
              {
                path: "courses",
                element: <CoursesPage />,
              },
              {
                path: "courses/create",
                element: <CreateCourse />,
              },
              {
                path: "courses/edit/:id",
                element: <EditCourse />,
              },
              {
                path: "articles",
                element: <ArticlesPage />,
              },
              {
                path: "articles/create",
                element: <CreateArticles />,
              },
              {
                path: "articles/edit/:id",
                element: <EditArticles />,
              },
            ],
          },
        ],
      },
    ],
  },
];
