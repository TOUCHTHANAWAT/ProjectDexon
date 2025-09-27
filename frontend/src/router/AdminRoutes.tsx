import { lazy } from "react";
import { type RouteObject } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";
import FullLayout from "../layout/FullLayout";

const MainPages = Loadable(lazy(() => import("../page/login")));
const Dashboard = Loadable(lazy(() => import("../page/dashbord")));
const CML = Loadable(lazy(() => import("../page/CML")));
const TestPoint = Loadable(lazy(() => import("../page/TestPoint")));
const Thickness = Loadable(lazy(() => import("../page/Thickness")));

const AdminRoutes = (isLoggedIn: boolean): RouteObject => {
  return {
    path: "/",
    element: isLoggedIn ? <FullLayout /> : <MainPages />,
        children: [
      { path: "/", element: <Dashboard /> },
      { path: "/CML/:id", element: <CML /> },
      { path: "/TestPoint/:id", element: <TestPoint /> },
      { path: "/Thickness/:id", element: <Thickness /> },
      // {
      //   path: "/customer",
      //   element: <Dashboard />,
      // },
      // {
      //   path: "/customer",
      //   element: <Dashboard />,
      // },
      // {
      //   path: "/customer/create",
      //   element: <Dashboard />,
      // },
      // {
      //   path: "/customer/edit/:id",
      //   element: <Dashboard />,
      // },
      // {
      //   path: "/customer/import",
      //   element: <Dashboard />,
      // },
      // {
      //   path: "/customer/export",
      //   element: <Dashboard />,
      // },
    ],
  };
};

export default AdminRoutes;
