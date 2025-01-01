import "./styles/authLayout.css";
import arrow from "../assets/svgs/arrow_back.svg";
import { Link, Navigate } from "react-router-dom";
import triangle from "../assets/svgs/triangle-cheese.svg";
import { useTheme } from "../utils/ThemeContext";

const AuthLayout = ({ children }) => {
  const { theme } = useTheme();
  const isAuthenticated = localStorage.getItem("token");

  if (!!isAuthenticated) {
    return <Navigate to="/space" replace />;
  }

  return (
    <div className="auth-layout">
      <Link to="/">
        <img
          src={arrow}
          alt="arrow"
          className={
            "auth-layout__arrow " + (theme === "light" ? "inversion" : "")
          }
        />
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
