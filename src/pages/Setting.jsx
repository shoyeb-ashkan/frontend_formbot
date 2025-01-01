import "./styles/setting.css";
import logout from "../assets/svgs/logout.svg";
import { useHandleLogout } from "./../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Form from "./../components/Form";
import { resetError, updateUserDetails } from "../features/user/userSlice";
import { toast } from "react-hot-toast";

const Setting = () => {
  const { user } = useSelector((state) => state.user);
  const handleLogout = useHandleLogout();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    newPassword: "",
  });

  const [formError, setFormError] = useState({
    name: false,
    email: false,
    password: false,
    newPassword: false,
  });

  const [errorMessage, setErrorMessage] = useState({
    name: { message: "Name should be at least 3 characters long!" },
    email: { message: "Valid email is required!" },
    password: {
      message:
        "Password must be at least 8 characters and contain at least one letter and one number!",
    },
    newPassword: {
      message: "New password should not be the same as the old password!",
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        newPassword: "",
      });
    }
  }, [user]);

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
              message: "Password must be alphanumeric (no special characters)!",
            },
          }));
        }
        isValid = isLengthValid && isAlphanumeric;
        break;
      case "newPassword":
        const isAlphanum = /^(?=.*[a-zA-Z])(?=.*\d).+$/.test(value);
        const isLenVal = value.trim().length >= 8;

        if (!isLenVal) {
          setErrorMessage((prev) => ({
            ...prev,
            newPassword: {
              message: "New password must be at least 8 characters!",
            },
          }));
        } else if (!isAlphanum) {
          setErrorMessage((prev) => ({
            ...prev,
            newPassword: {
              message:
                "New password must be alphanumeric (no special characters)!",
            },
          }));
        } else if (value === formData.password) {
          setErrorMessage((prev) => ({
            ...prev,
            newPassword: {
              message:
                "New password should not be the same as the old password!",
            },
          }));
        }
        isValid = isLenVal && isAlphanum && value !== formData.password;
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
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const formFields = [
    {
      name: "name",
      value: formData.name,
      onChange: handleChange,
      type: "text",
      placeholder: "Name",
      required: false,
    },
    {
      name: "email",
      value: formData.email,
      onChange: handleChange,
      type: "email",
      placeholder: "Update Email",
      required: false,
    },
    {
      name: "password",
      value: formData.password,
      onChange: handleChange,
      type: "password",
      placeholder: "Old Password",
      required: !!formData.newPassword,
    },
    {
      name: "newPassword",
      value: formData.newPassword,
      onChange: handleChange,
      type: "password",
      placeholder: "New Password",
      required: !!formData.password,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isError = false;

    // Validating all fields before submitting
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        const isValid = validateField(key, formData[key]);
        if (!isValid) {
          isError = true;
        }
      }
    });
    if (isError) return;

    const updatedData = {};

    if (formData.name !== user.name) {
      updatedData.name = formData.name;
    }
    if (formData.email !== user.email && formData.email !== "") {
      updatedData.email = formData.email;
    }
    if (formData.password) {
      updatedData.password = formData.password;
    }
    if (formData.newPassword) {
      updatedData.newPassword = formData.newPassword;
    }
    if (Object.keys(updatedData).length === 0) {
      toast("⚠️ Please make some changes first!", {
        style: {
          background: "#FFFACD",
          color: "#333",
        },
      });
      return;
    }
    const result = await dispatch(updateUserDetails(updatedData));

    if (result.type === "user/updateUserDetails/fulfilled") {
      toast.success("Profile updated successfully!");
    } else {
      toast.error(result.payload.message || "Failed to update profile.");
      dispatch(resetError());
    }
  };

  return (
    <div className="setting__container">
      <div className="setting__title">Setting</div>
      <div className="setting__form">
        <Form
          buttonText={"Update"}
          formError={formError}
          formFields={formFields}
          onSubmit={handleSubmit}
          errorMessage={errorMessage}
        />
      </div>
      <div className="setting__button">
        <button onClick={handleLogout}>
          <img src={logout} alt="logout" />
          Log Out
        </button>
      </div>
    </div>
  );
};
export default Setting;
