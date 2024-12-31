import "./styles/space.css";
import uparrow from "../assets/svgs/up-arrow.svg";
import downarrow from "../assets/svgs/down-arrow.svg";
import rootFolder from "../assets/svgs/root-folder.svg";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme } from "../utils/ThemeContext";
import PreLoader from "./../components/PreLoader";
import { useHandleLogout } from "../utils/utils";
import ToggleTheme from "../components/ToggleTheme";
import ShareSpace from "../components/ShareSpace";

const Space = ({ children }) => {
  const { theme } = useTheme();
  const { space, error } = useSelector((state) => state.space);
  const { user } = useSelector((state) => state.user);
  const { spaceId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const handleLogout = useHandleLogout();
  const setShow = (e) => {
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  const handleOutsideClick = (event) => {
    const modalContainer = document.querySelector(".space__header__links");
    if (!modalContainer.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const canShare = space?.owner.toString() === user?._id.toString();

  if (!space && !error) return <PreLoader />;

  return (
    <div className="space">
      <div className="space__header">
        <div />
        <div className="space__header__container">
          <div className="space__header__title">
            <div className="space__header__links">
              <button
                onClick={setShow}
                className="space__header__button space__header__button__title"
              >
                <p>{space.name}</p>
                <img
                  className={theme === "dark" ? "inversion" : ""}
                  src={isOpen ? uparrow : downarrow}
                  alt="arrow"
                />
              </button>
              {isOpen && (
                <>
                  {user.spaces
                    .filter(({ space }) => {
                      return space._id.toString() !== spaceId;
                    })
                    .map(({ space }) => {
                      return (
                        <Link
                          className="no-select space__header__button__title"
                          key={space._id}
                          to={`/space/${space._id}`}
                        >
                          <p>{space.name}</p>
                        </Link>
                      );
                    })}
                  <Link to="/space/setting">Setting</Link>
                  <button
                    className="space__header__button space__header__logout"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </>
              )}
            </div>
          </div>
          <ToggleTheme />
          <button
            onClick={() => setShowShare(true)}
            disabled={!canShare}
            className={"space__header__share" + (canShare ? "" : " disabled")}
          >
            Share
          </button>
        </div>
      </div>
      <div className="space__main">
        <Link
          title="root folder"
          className="main__space__link no-select"
          to={`/space/${spaceId}`}
        >
          <img
            className={
              "space__main__root " + (theme === "dark" ? "inversion" : "")
            }
            src={rootFolder}
            alt="root folder"
          />
        </Link>
        <section className="space__main__section">{children}</section>
      </div>
      {showShare && (
        <ShareSpace
          setShowShare={setShowShare}
          spaceId={spaceId}
          ownerEmail={user?.email}
        />
      )}
    </div>
  );
};
export default Space;
