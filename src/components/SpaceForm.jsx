import "./styles/spaceform.css";
import deleteIcon from "../assets/svgs/delete.svg";
import { useNavigate, useParams } from "react-router";
const SpaceForm = ({
  handleDeleteFormOrFolder,
  handleAddFormOrFolder,
  forms,
  canEdit,
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
          disabled={!canEdit}
          onClick={() => handleAddFormOrFolder("Form")}
          className={
            "space__form__button no-select space__form__create " +
            (canEdit ? "" : "disabled")
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
            className="space__form__button"
          >
            {form.name}
          </button>
          <button
            disabled={!canEdit}
            onClick={() => handleDeleteFormOrFolder("Form", form._id)}
            className={
              "space__form__delete__button " + (canEdit ? "" : "disabled")
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
