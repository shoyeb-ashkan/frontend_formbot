import { useEffect } from "react";
import "./styles/createFromOrFolder.css";
import { useSelector } from "react-redux";

const CreateFormOrFolder = ({ mode, setName, onSubmit, setShow }) => {
  const handleCancle = (e) => {
    e.preventDefault();
    setShow(false);
  };

  const { loading } = useSelector((state) => state.space);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  const handleOutsideClick = (event) => {
    const modalContainer = document.querySelector(
      ".createformorfolder__input__container"
    );
    if (!modalContainer.contains(event.target)) {
      setShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  return (
    <div className="createformorfolder__container">
      <div className="createformorfolder__input__container">
        <p className="createformorfolder__input__container__title">
          Create New {mode}
        </p>
        <input
          className="createformorfolder__input__container__input"
          type="text"
          placeholder={`Enter ${mode} name`}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="createformorfolder__input__container__buttons">
          <button
            disabled={loading}
            className={
              "createformorfolder__done " + (loading ? "disabled" : "")
            }
            onClick={handleSubmit}
          >
            Done
          </button>
          <button className="createformorfolder__cancel" onClick={handleCancle}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default CreateFormOrFolder;
