import "./styles/formUser.css";
import { useNavigate, useParams } from "react-router-dom";
import { getFormData, updateFormResponse } from "./../utils/AxiosRequest";
import { useEffect, useState } from "react";
import PreLoader from "./../components/PreLoader";
import { toast } from "react-hot-toast";

import send from "../assets/svgs/send.svg";
import logo from "/logo.svg";
import SuccessExcerpt from "../components/SuccessExcerpt";

const FormUser = () => {
  const { formId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tempValues, setTempValues] = useState({});
  const [currentIndex, setCurrentIndex] = useState(-1); // Tracks the current visible item index
  const [isTyping, setIsTyping] = useState(false);
  const [firstNonBubbleIndex, setFirstNonBubbleIndex] = useState(-1);
  const [showSuccessExcerpt, setShowSuccessExcerpt] = useState(false);
  const renderBubblesAndInput = (data, startIndex) => {
    const nextNonBubbleIndex = data.findIndex(
      (item, index) => index >= startIndex && !item.isBubble
    );

    let index = startIndex;

    const showNextBubble = () => {
      if (index <= nextNonBubbleIndex && data[index]?.isBubble) {
        setIsTyping(true);
        setCurrentIndex(index); // Render the current bubble
        setTimeout(() => {
          setIsTyping(false);
          index++;
          showNextBubble();
        }, 2000);
      } else {
        setTimeout(() => {
          setCurrentIndex(index);
        }, 500);
      }
    };

    showNextBubble();
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  const handleFetchData = async () => {
    setLoading(true);
    const response = await getFormData(formId);
    if (response) {
      setLoading(false);
      if (response.error) {
        toast.error(response.message);
        return navigate("/404");
      }

      const firstIndex = response.data.findIndex((item) => !item.isBubble);
      setFirstNonBubbleIndex(firstIndex);
      setForm(response.data);

      // Start rendering bubbles and input from index 0
      renderBubblesAndInput(response.data, 0);
    }
  };

  const handleInputChange = (index, value, type) => {
    if (type === "phone") {
      const phoneValue = value.replace(/[^0-9]/g, "");
      setTempValues((prev) => ({
        ...prev,
        [index]: phoneValue,
      }));
    } else {
      setTempValues((prev) => ({
        ...prev,
        [index]: value,
      }));
    }
  };

  const handleSetValue = async (index) => {
    if (form[index]?.type === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(tempValues[index])) {
        return toast.error("Please enter a valid email address.");
      }
    }
    if (index === firstNonBubbleIndex && !form[index]?.value) {
      await updateFormResponse(formId, {
        started: true,
      });
    }
    const updatedForm = [...form];
    updatedForm[index].value = tempValues[index]; // Save input value
    setForm(updatedForm);

    // Reset temp value
    setTempValues((prev) => ({ ...prev, [index]: "" }));

    if (form[index + 1]?.isBubble) {
      renderBubblesAndInput(form, index + 1); // Handle bubble rendering
    } else {
      setCurrentIndex(index + 1); // Render non-bubble item immediately
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    const responseData = form.map((item) => ({
      id: item.id,
      value: item.value, // Only send the value if it's filled in
    }));

    const res = await updateFormResponse(formId, {
      response: responseData,
    });

    if (res) {
      setLoading(false);
      if (res.error) {
        toast.error(res.message);
        return;
      }

      setShowSuccessExcerpt(true);
    }
  };

  return (
    <div className="formUser">
      <div className="formUser__container">
        {form.map((item, index) => {
          if (index > currentIndex) return null;
          // Hide items beyond the currentIndex
          return (
            <div
              key={index}
              className={`formUser__item ${item.isBubble ? "bubble" : ""}`}
            >
              {item.isBubble ? (
                <div className="userForm__bubble__container">
                  {isTyping && index === currentIndex ? (
                    <div className="userForm__typing">
                      <img
                        className="userForm__bubble__avatar"
                        src={logo}
                        alt="typing"
                      />
                      <span className="userForm__bubble__typing__container">
                        <span className="userForm__bubble__typing"></span>
                      </span>
                    </div>
                  ) : (
                    <div className="userForm__bubble">
                      <img
                        className="userForm__bubble__avatar"
                        src={logo}
                        alt="logo"
                      />
                      {item.type === "text" ? (
                        <span className="userForm__bubble__text">
                          {item.value}
                        </span>
                      ) : item.type === "image" || item.type === "gif" ? (
                        <img
                          className="userForm__bubble__img"
                          src={item.value}
                          alt="image"
                        />
                      ) : (
                        <video
                          className="userForm__bubble__img"
                          src={item.value}
                          alt="file"
                          controls
                        />
                      )}
                    </div>
                  )}
                </div>
              ) : item.type === "buttons" ? (
                <button
                  onClick={(e) => handleSubmitForm(e)}
                  className="userForm__submit__button"
                >
                  <img src={send} alt="button" />
                </button>
              ) : item.type === "rating" ? (
                <div className="rating">
                  <div className="rating__buttons">
                    {[1, 2, 3, 4, 5].map((child, i) => (
                      <button
                        className={
                          "rating__button" +
                          (tempValues[index] === child ||
                          form[index].value === child
                            ? " selected__button"
                            : "")
                        }
                        onClick={() =>
                          handleInputChange(index, child, item.type)
                        }
                        key={i}
                      >
                        {child}
                      </button>
                    ))}
                  </div>
                  {!form[index]?.value && (
                    <button
                      disabled={!tempValues[index]}
                      className={
                        "userForm__submit__button" +
                        (tempValues[index] ? "" : " disabled")
                      }
                      onClick={() => handleSetValue(index)}
                    >
                      <img src={send} alt="button" />
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {item.value ? (
                    <div className="userForm__read-only">
                      <span>{item.value}</span>
                    </div>
                  ) : (
                    <>
                      <input
                        className="userForm__input"
                        type={item.type === "phone" ? "tel" : item.type}
                        value={tempValues[index] || ""}
                        placeholder={"Please enter a " + item.type}
                        min={0}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value, item.type)
                        }
                      />
                      <button
                        disabled={!tempValues[index]}
                        className={
                          "userForm__submit__button" +
                          (tempValues[index] ? "" : " disabled")
                        }
                        onClick={() => handleSetValue(index)}
                      >
                        <img src={send} alt="button" />
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
      {loading && <PreLoader />}
      {showSuccessExcerpt && <SuccessExcerpt />}
    </div>
  );
};

export default FormUser;
