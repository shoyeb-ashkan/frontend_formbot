import "./styles/register.css";
import { useEffect, useState } from "react";
import Form from "../components/Form";
import googleIcon from "../assets/svgs/googleIcon.svg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/user/userSlice";
import toast from "react-hot-toast";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formError, setFormError] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [errorMessage, setErrorMessage] = useState({
    name: { message: "Name should be on atleast 3 characters long!" },
    email: { message: "Valid email is required!" },
    password: {
      message:
        "Password must be at least 8 characters and contain at least one letter and one number!",
    },
    confirmPassword: { message: "Passwords do not match!" },
  });

  const validateField = (fieldName, value) => {
    let isValid = false;

    switch (fieldName) {
      case "name":
        isValid = value.trim().length > 2;
        break;
      case "email":
        isValid = /\S+@\S+\.\S+/.test(value);
        break;
      case "password":
        const isAlphanumeric = /^(?=.*[a-zA-Z])(?=.*\d).+$/.test(value);
        const isLengthValid = value.trim().length >= 8;

        if (!isLengthValid) {
          setErrorMessage((prev) => ({
            ...prev,
            password: { message: "Password must be at least 8 characters!" },
          }));
        } else if (!isAlphanumeric) {
          setErrorMessage((prev) => ({
            ...prev,
            password: {
              message: "Password must Alphanumeric(no special characters)!",
            },
          }));
        }
        isValid = isLengthValid && isAlphanumeric;
        break;
      case "confirmPassword":
        isValid = value === formData.password;
        break;
      default:
        break;
    }

    setFormError((prev) => ({
      ...prev,
      [fieldName]: !isValid,
    }));
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  const formFields = [
    {
      name: "name",
      value: formData.name,
      onChange: handleChange,
      type: "text",
      placeholder: "Name",
      require: true,
    },
    {
      name: "email",
      value: formData.email,
      onChange: handleChange,
      type: "email",
      placeholder: "Email",
      require: true,
    },
    {
      name: "password",
      value: formData.password,
      onChange: handleChange,
      type: "password",
      placeholder: "Password",
      require: true,
    },
    {
      name: "confirmPassword",
      value: formData.confirmPassword,
      onChange: handleChange,
      type: "password",
      placeholder: "Confirm password",
      require: true,
    },
  ];

  const onSubmit = (e) => {
    e.preventDefault();
    let isError = false;

    // Validate all fields before submitting
    Object.keys(formData).forEach((key) => {
      const isValid = validateField(key, formData[key]);
      if (!isValid) {
        isError = true;
      }
    });
    if (isError) return;

    dispatch(registerUser(formData));
  };

  useEffect(() => {
    if (success) {
      toast.success("Authentication successfull!");
      navigate("/");
      setFormData({
        email: "",
        password: "",
      });
    }
  }, [loading, success, error]);

  return (
    <div className="register__login-container">
      <Form
        formError={formError}
        formFields={formFields}
        onSubmit={onSubmit}
        errorMessage={errorMessage}
        buttonText={"Register"}
      />
      <p>OR</p>

      <a className="login__google" href="#" onClick={(e) => e.preventDefault()}>
        <img src={googleIcon} alt="google" />
        Sign Up with Google
      </a>

      <div className="login__register">
        {" "}
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </div>
  );
};
export default Register;
