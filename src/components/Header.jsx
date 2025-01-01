import "./styles/header.css";
import logo from "/logo.svg";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="header__container">
      <div className="header__logo-container no-select">
        <img src={logo} alt="logo" className="header__logo" />
        FormBot
      </div>{" "}
      <div className="header__nav-container">
        <Link className="header__nav-link1" to="/login">
          Sign In
        </Link>
        <Link className="header__nav-link2" to="/login">
          Create a FormBot
        </Link>
      </div>
    </div>
  );
};
export default Header;
