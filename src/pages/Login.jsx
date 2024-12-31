import "./styles/login.css";
import { useEffect, useState } from "react";
import Form from "../components/Form";
import googleIcon from "../assets/svgs/googleIcon.svg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/user/userSlice";
import { toast } from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { success, loading, error, user } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState({
    email: false,
    password: false,
  });

  const [errorMessage, setErrorMessage] = useState({
    email: { message: "Valid email is required!" },
    password: {
      message:
        "Password must be at least 8 characters and contain at least one letter and one number!",
    },
  });

  const validateField = (fieldName, value) => {
    let isValid = false;

    switch (fieldName) {
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
      name: "email",
      type: "email",
      placeholder: "Enter your email",
      value: formData.email,
      onChange: handleChange,
      validate: validateField,
    },
    {
      name: "password",
      type: "password",
      placeholder: "*************",
      value: formData.password,
      onChange: handleChange,
      validate: validateField,
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

    dispatch(loginUser(formData));
  };

  useEffect(() => {
    if (success) {
      toast.success("Authentication successfull!");

      navigate(`/space/${user.spaces[0].space._id.toString()}`);
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
        buttonText={"Log In"}
      />

      <p>OR</p>

      <a className="login__google" href="#" onClick={(e) => e.preventDefault()}>
        <img src={googleIcon} alt="google" />
        Sign In with Google
      </a>

      <div className="login__register">
        {" "}
        Don't have an account? <Link to="/register">Register now</Link>
      </div>
    </div>
  );
};
export default Login;
