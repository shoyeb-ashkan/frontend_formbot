import { createBrowserRouter } from "react-router-dom";
import App from "./../App";
import AuthLayout from "./../layout/AuthLayout";
import Login from "./../pages/Login";
import Register from "./../pages/Register";
import Home from "./../pages/Home";
import ProtectedLayout from "./../layout/ProtectedLayout";
import Space from "./../pages/Space";
import Setting from "../pages/Setting";
import NotFound from "../pages/NotFound";
import SpaceMain from "../components/SpaceMain";
import FormSpace from "../pages/FormSpace";
import FormUser from "../pages/FormUser";
import AddSpace from "../pages/AddSpace";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "register",
        element: (
          <AuthLayout>
            <Register />
          </AuthLayout>
        ),
      },
      {
        path: "login",
        element: (
          <AuthLayout>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "space",
        element: <ProtectedLayout />,
        children: [
          {
            path: "share",
            element: <AddSpace />,
          },
          {
            path: "setting",
            element: <Setting />,
          },

          {
            path: ":spaceId",
            children: [
              {
                path: "",
                element: (
                  <Space>
                    <SpaceMain />
                  </Space>
                ),
              },
              {
                path: "folder/:folderId",
                element: (
                  <Space>
                    <SpaceMain />
                  </Space>
                ),
              },
              {
                path: "form/:formId",
                children: [
                  {
                    path: "flow",
                    element: <FormSpace />,
                  },
                  {
                    path: "response",
                    element: <FormSpace />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "form/:formId",
        element: <FormUser />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
