import { Link } from "react-router-dom";
import "./styles/notFound.css";

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found__content">
        <h1 className="not-found__title">404</h1>
        <p className="not-found__text">
          Oops! Looks like you're lost in the void. Even we couldn’t find this page.
        </p>
        <p className="not-found__emoji">🚀🌌</p>
        <p className="not-found__funny">
          Maybe it's hiding under the couch? 🛋️
        </p>
        <Link to="/" className="not-found__button">
          Take me home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
