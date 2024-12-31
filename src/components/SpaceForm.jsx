import "./styles/spaceform.css";
import deleteIcon from "../assets/svgs/delete.svg";
import { useNavigate, useParams } from "react-router";
const SpaceForm = ({
  handleDeleteFormOrFolder,
  handleAddFormOrFolder,
  forms,
  canEdit,
  loading,
}) => {
  const navigate = useNavigate();
  const { spaceId } = useParams();
  const handleNavigate = (form) => {
    navigate(`/space/${spaceId}/form/${form?._id}/flow`);
  };

  return (
    <div className="space__form__container">
      <div className="space__form__button__container ">
        <button
          disabled={!canEdit || loading}
          onClick={() => handleAddFormOrFolder("Form")}
          className={
            "space__form__button no-select space__form__create " +
            (canEdit || !loading ? "" : "disabled")
          }
        >
          <p>+</p>
          Create a typebot
        </button>
      </div>
      {forms.map((form) => (
        <div
          key={form._id}
          className="space__form__button__container no-select"
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              handleNavigate(form);
            }}
            disabled={!canEdit || loading}
            className={"space__form__button " + (!loading ? "" : "disabled")}
          >
            {form.name}
          </button>
          <button
            disabled={!canEdit || loading}
            onClick={() => handleDeleteFormOrFolder("Form", form._id)}
            className={
              "space__form__delete__button " +
              (canEdit || !loading ? "" : "disabled")
            }
          >
            <img src={deleteIcon} alt="delete" />
          </button>
        </div>
      ))}
    </div>
  );
};
export default SpaceForm;
