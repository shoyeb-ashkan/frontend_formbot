import "./styles/editForm.css";
import flag from "../assets/svgs/flag.svg";
import message from "../assets/svgs/message.svg";
import image from "../assets/svgs/image.svg";
import video from "../assets/svgs/video.svg";
import gif from "../assets/svgs/gif.svg";
import text from "../assets/svgs/text.svg";
import number from "../assets/svgs/number.svg";
import email from "../assets/svgs/email.svg";
import phone from "../assets/svgs/phone.svg";
import date from "../assets/svgs/date.svg";
import rating from "../assets/svgs/rating.svg";
import button from "../assets/svgs/button.svg";
import deleteIcon from "../assets/svgs/delete.svg";

import { fieldInputs } from "../utils/input";
import { toast } from "react-hot-toast";
import PreLoader from "./../components/PreLoader";

const EditForm = ({
  loading,
  errorFields,
  setErrorFields,
  canEdit,
  formData = { data: [] },
  setFormData,
}) => {
  const createNewField = (type, isBubble) => {
    // input label number to create a new field based on latest number to get unique label for each field
    const maxNumber = Math.max(
      0,
      ...formData.data
        .filter((field) => field.type === type && field.isBubble === isBubble)
        .map((field) => {
          const matches = field.label.match(/(\d+)$/);
          return matches ? parseInt(matches[1]) : 0;
        })
    );

    const newLabelNumber = maxNumber > 0 ? maxNumber + 1 : 1;

    return {
      id: Date.now(),
      type,
      isBubble,
      value: "",
      label: isBubble
        ? `${type.charAt(0).toUpperCase() + type.slice(1)} ${newLabelNumber}`
        : `Input ${
            type.charAt(0).toUpperCase() + type.slice(1)
          } ${newLabelNumber}`,
    };
  };

  const handleInputClick = (type, isBubble) => {
    if (
      formData.data.length > 0 &&
      formData.data[formData.data.length - 1].type === "buttons"
    ) {
      toast("You cannot add new fields after a button has been added.", {
        icon: "⚠️",
        style: {
          border: "1px solid #FFA500",
          padding: "6px",
          color: "#333",
          fontSize: "12px",
          backgroundColor: "#FFFAE5",
        },
      });
      return;
    }

    const newField = createNewField(type, isBubble);
    setFormData((prev) => ({
      ...prev,
      data: [...prev.data, newField],
    }));
  };

  const handleBubbleChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      data: prev.data.map((field) =>
        field.id === id ? { ...field, value } : field
      ),
    }));

    setErrorFields((prev) => prev.filter((fieldId) => fieldId !== id));
  };

  const handleRemoveField = (id) => {
    setFormData((prev) => ({
      ...prev,
      data: prev.data.filter((field) => field.id !== id),
    }));

    setErrorFields((prev) => prev.filter((fieldId) => fieldId !== id));
  };

  // button icon for input
  const inputIcons = {
    text,
    email,
    number,
    phone,
    date,
    rating,
    buttons: button,
  };

  return (
    <div className="editform__container">
      {/* show preloader while loading the form */}
      {loading && <PreLoader />}
      <div className="editform__sidebar">
        <div className="editform__sidebar__bubbles">
          <p>Bubbles</p>
          <div className="editform__sidebar__buttons">
            <button
              onClick={() => handleInputClick("text", true)}
              className={!canEdit || loading ? "disabled" : ""}
              disabled={!canEdit || loading}
            >
              <img src={message} alt="message" />
              Text
            </button>
            <button
              className={!canEdit || loading ? "disabled" : ""}
              disabled={!canEdit || loading}
              onClick={() => handleInputClick("image", true)}
            >
              <img src={image} alt="image" />
              Image
            </button>
            <button disabled className="disabled" title="Coming soon">
              <img src={video} alt="video" />
              Video
            </button>
            <button disabled className="disabled" title="Coming soon">
              <img src={gif} alt="gif" />
              GIF
            </button>
          </div>
        </div>
        <div className="editform__sidebar__inputs">
          <p>Inputs</p>
          <div className="editform__sidebar__buttons">
            {fieldInputs?.map((input) => (
              <button
                className={!canEdit || loading ? "disabled" : ""}
                disabled={!canEdit || loading}
                key={input.type}
                onClick={() => handleInputClick(input.type, false)}
              >
                <img src={inputIcons[input.type]} alt={input.type} />
                {input.type}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="editform__main">
        <div className="editform__header">
          <img src={flag} alt="flag" />
          Start
        </div>

        {formData?.data?.map((field) => (
          <div key={field.id} className="editform__field__container">
            <div
              className={`editform__field ${
                errorFields.includes(field.id) ? "field-error" : ""
              }`}
            >
              <label>{field.label}</label>
              {field.isBubble ? (
                <>
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) =>
                      handleBubbleChange(field.id, e.target.value)
                    }
                    placeholder={`Enter ${
                      field.type !== "text" ? `${field.type} link` : field.type
                    }`}
                  />
                  <div className="editform__field__error">
                    {errorFields.includes(field.id) && "Required field"}
                  </div>
                </>
              ) : (
                <span>Hint: to be filled by the user</span>
              )}
            </div>
            <button
              className="editform__field__delete"
              onClick={() => handleRemoveField(field.id)}
            >
              <img src={deleteIcon} alt="delete" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditForm;
