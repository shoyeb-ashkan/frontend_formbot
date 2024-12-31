import { useEffect } from "react";
import "./styles/deleteFormOrFolder.css";
import { useSelector } from "react-redux";

const DeleteFormOrFolder = ({ onSubmit, setShow, mode }) => {
  const { loading } = useSelector((state) => state.space);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };
  const handleOutsideClick = (event) => {
    const modalContainer = document.querySelector(
      ".deleteformorfolder__container"
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
    <div className="deleteformorfolder__container">
      <p className="deleteformorfolder__title">
        Are you sure you want to delete this {mode}?
      </p>
      <div className="deleteformorfolder__buttons">
        <button
          disabled={loading}
          onClick={handleSubmit}
          className="deleteformorfolder__delete"
        >
          Delete
        </button>
        <button
          onClick={() => setShow(false)}
          className="deleteformorfolder__cancel"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
export default DeleteFormOrFolder;
