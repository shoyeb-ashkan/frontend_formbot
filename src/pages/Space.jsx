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

  const { space } = useSelector((state) => state.space);
  const { user } = useSelector((state) => state.user);
  const { spaceId } = useParams();
  const handleLogout = useHandleLogout();

  const [isOpen, setIsOpen] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // show and hide the header tray
  const setShow = (e) => {
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  // close the header tray when clicking outside
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

  //check the share access of the space (only owner can share the space)
  const canShare = space?.owner.toString() === user?._id.toString();

  // till space load show preloader
  if (!space) return <PreLoader />;

  return (
    <div className="space">
      <div className="space__header">
        <div />
        <div className="space__header__container">
          <div className="space__header__title">
            <div className="space__header__links">
              {/* header button to show the active space title and to open and close the header tray */}
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
              {/* header tray  */}
              {isOpen && (
                <>
                  {user.spaces.map(({ space }) => {
                    if (space._id.toString() === spaceId) return;
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
          {/* theme toggle modal  */}
          <ToggleTheme />
          {/* share space button  */}
          <button
            onClick={() => setShowShare(true)}
            disabled={!canShare}
            className={"space__header__share" + (canShare ? "" : " disabled")}
          >
            Share
          </button>
        </div>
      </div>

      {/* root folder button to go back to root folder */}
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
        {/* render children of space (form or folder)  */}
        <section className="space__main__section">{children}</section>
      </div>

      {/* share space modal to share the space with other users */}
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
