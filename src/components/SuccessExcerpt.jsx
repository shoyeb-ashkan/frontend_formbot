import { useNavigate } from "react-router";
import "./styles/successExcerpt.css";

const SuccessExcerpt = () => {
    const navigate = useNavigate();
  return (
    <div className="successExcerpt__container">
      <div className="successExcerpt__content">
        <h2> Response saved successfully! </h2>

        <button
          onClick={() => {
            navigate("/");
            window.location.reload();
          }}
          className="successExcerpt__button"
        >
          Okay!
        </button>
      </div>
    </div>
  );
};
export default SuccessExcerpt;
