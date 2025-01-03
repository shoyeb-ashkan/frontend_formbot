import "./styles/form.css";
import { useState } from "react";
import eye from "../assets/svgs/eye.svg";
import eyeOff from "../assets/svgs/eye-hide.svg";
import Loading from "./Loading";
import { useSelector } from "react-redux";

const Form = ({
  formError,
  formFields,
  onSubmit,
  errorMessage,
  buttonText,
  applyTheme = false,
}) => {
  const [showPassword, setShowPassword] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const togglePasswordVisibility = (fieldName) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form className="main__form" onSubmit={handleSubmit}>
      {formFields.map((field, index) => (
        <div key={index} className="form-container">
          {" "}
          <span
            className={
              "input__container " +
              `${formError[field.name] ? "input__error" : ""}`
            }
          >
            <label
              className={applyTheme ? "input__label" : ""}
              htmlFor={field.name}
            >
              {field.name}
            </label>
            <input
              id={field.name}
              name={field.name}
              value={field.value}
              className={applyTheme ? "input__field" : ""}
              onChange={field.onChange}
              required={field.required}
              placeholder={field.placeholder}
              type={
                field.type === "password" && showPassword[field.name]
                  ? "text"
                  : field.type
              }
            />
            {field.type === "password" && (
              <span className="input__icon__passowrd">
                <img
                  title="Show/Hide"
                  onClick={() => togglePasswordVisibility(field.name)}
                  src={showPassword[field.name] ? eyeOff : eye}
                  alt="eye-icon"
                />
              </span>
            )}
          </span>
          <div className="error__message">
            {formError[field.name] && errorMessage[field.name].message}
          </div>
        </div>
      ))}
      <button disabled={loading} type="submit">
        {loading ? <Loading /> : buttonText}
      </button>
      <div className="error__message">{error}</div>
    </form>
  );
};
export default Form;
