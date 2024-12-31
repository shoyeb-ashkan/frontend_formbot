import "./styles/formSpace.css";
import { Link, NavLink, useLocation, useParams } from "react-router";
import ToggleTheme from "../components/ToggleTheme";
import close from "../assets/svgs/close.svg";
import EditForm from "./EditForm";
import FormResponse from "./FormResponse";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFormData } from "../utils/utils";
import toast from "react-hot-toast";
import { backToDefault, updateForm } from "../features/space/spaceSlice";

const FormSpace = () => {
  const dispatch = useDispatch();
  const { formId, spaceId } = useParams();

  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.user);
  const { space, loading } = useSelector((state) => state.space);
  const [formData, setFormData] = useState({
    name: "",
    data: [],
  });
  const [form, setForm] = useState();
  const [errorFields, setErrorFields] = useState([]);

  useEffect(() => {
    if (space) {
      const result = getFormData(space.rootFolder, formId);

      if (result) {
        setFormData({
          name: result?.name || "",
          data: result?.data ? [...result?.data] : [],
        });
        setForm(result);
      }
    }
  }, [space]);

  const activeSpace =
    user?.spaces?.find(({ space }) => space._id.toString() === spaceId) || {};

  const handleChange = (e) => {
    e.preventDefault();
    setFormData((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isFormModified =
      formData.name !== form.name ||
      JSON.stringify(formData.data) !== JSON.stringify(form.data);

    if (!isFormModified) {
      toast.error("Please make some changes before saving.");
      return;
    }

    const emptyFields = formData.data
      .filter((field) => field.isBubble && !field.value.trim())
      .map((field) => field.id);

    if (emptyFields.length > 0) {
      setErrorFields(emptyFields);
      toast.error("Please fill all required fields before submitting.");
      return;
    }

    const result = await dispatch(
      updateForm({ spaceId, formId, formData, parentId: form.parent })
    );

    if (result.type === "space/updateForm/fulfilled") {
      dispatch(backToDefault());
      toast.success("Form Saved successfully!");
    }

    if (result.type === "space/updateForm/rejected") {
      toast.error(result.payload.message);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();

    if (form?.data[form?.data.length - 1]?.type !== "buttons") {
      toast.error(
        "You need to add a button to complete the form, in order to share it. "
      );
      return;
    }
    const formUrl = `${window.location.origin}/form/${formId}`;

    navigator.clipboard
      .writeText(formUrl)
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard!");
      });
  };


  return (
    <div className="formspace__container">
      <div className="formspace__header">
        <div className="formspace__header__input__container">
          {pathname === `/space/${spaceId}/form/${formId}/flow` && (
            <input
              className="formspace__header__input"
              placeholder="Enter form name"
              value={formData.name}
              onChange={handleChange}
              type="text"
            />
          )}
        </div>
        <div className="formspace__header__routes">
          <NavLink
            to={`/space/${spaceId}/form/${formId}/flow`}
            className={({ isActive }) =>
              isActive ? "formspace__header__routes__active" : ""
            }
          >
            Flow
          </NavLink>
          <NavLink
            to={`/space/${spaceId}/form/${formId}/response`}
            className={({ isActive }) =>
              isActive ? "formspace__header__routes__active" : ""
            }
          >
            Response
          </NavLink>
        </div>
        <div className="formspace__header__buttons">
          <ToggleTheme />
          <button
            className={`formspace__header__button__share  
              ${
                form?.data[form?.data.length - 1]?.type !== "buttons"
                  ? " disabled"
                  : ""
              }`}
            onClick={(e) => handleShare(e)}
          >
            Share
          </button>
          <button
            disabled={
              !activeSpace?.canEdit ||
              loading ||
              pathname === `/space/${spaceId}/form/${formId}/response`
            }
            onClick={(e) => handleSubmit(e)}
            className={`formspace__header__button__save ${
              !activeSpace?.canEdit ||
              loading ||
              pathname === `/space/${spaceId}/form/${formId}/response`
                ? "disabled"
                : ""
            }`}
          >
            Save
          </button>
          <Link
            to={`/space/${spaceId}`}
            className="formspace__header__button__close"
          >
            <img src={close} alt="close" />
          </Link>
        </div>
      </div>
      <section className="formspace__section">
        {pathname === `/space/${spaceId}/form/${formId}/flow` && (
          <EditForm
            loading={loading}
            errorFields={errorFields}
            setErrorFields={setErrorFields}
            canEdit={activeSpace?.canEdit}
            formData={formData}
            setFormData={setFormData}
          />
        )}

        {pathname === `/space/${spaceId}/form/${formId}/response` && (
          <FormResponse form={form} loading={loading} />
        )}
      </section>
    </div>
  );
};
export default FormSpace;
