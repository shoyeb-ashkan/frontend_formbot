import { useEffect } from "react";
import "./styles/protectedLayout.css";
import { Outlet, useLocation, useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import { getUserDetails } from "../features/user/userSlice";
import { useHandleLogout } from "./../utils/utils";
import { getSpaces } from "../features/space/spaceSlice";

const ProtectedLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = useHandleLogout();
  const location = useLocation();
  const { spaceId } = useParams();

  const handleGetSpace = async () => {
    const response = await dispatch(getSpaces(spaceId));
    if (response.type === "space/getSpaces/rejected") {
      navigate("/404"); //if not valid space id redirect to 404
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleLogout();
    } else {
      dispatch(getUserDetails())
        .unwrap()
        .then((data) => {
          
          if (
            location.pathname === "/" ||
            location.pathname === "/login" ||
            location.pathname === "/register" ||
            location.pathname === "/space"
          ) {
            navigate(data.data.spaces[0].space._id.toString());
          }
        })
        .catch(() => {
          handleLogout();
        });
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && spaceId) {
      handleGetSpace();
    }
  }, [spaceId]);

  return (
    <div className="protected-layout">
      <Outlet />
    </div>
  );
};
export default ProtectedLayout;
