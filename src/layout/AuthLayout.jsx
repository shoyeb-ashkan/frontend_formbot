import "./styles/authLayout.css";
import arrow from "../assets/svgs/arrow_back.svg";
import { Link, useNavigate } from "react-router-dom";
import triangle from "../assets/svgs/triangle-cheese.svg";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

const AuthLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { success, loading, user } = useSelector((state) => state.user);
  const isAuthenticated = localStorage.getItem("token");

  if (!!isAuthenticated) {
    return navigate("/space");
  }

  useEffect(() => {
    if (!loading && success) {
      toast.success("Authentication successfull!");

      navigate(`/space/${user.spaces[0].space._id.toString()}`);
    }
  }, [loading, success]);

  return (
    <div className="auth-layout">
      <Link to="/">
        <img src={arrow} alt="arrow" className="auth-layout__arrow" />
      </Link>
      <div className="auth-layout__content">{children}</div>

      <img
        src={triangle}
        alt="triangle"
        className="triangle-container__triangle"
      />

      <div className="half-circle" />
      <div className="half-circle-vertical" />
    </div>
  );
};
export default AuthLayout;
