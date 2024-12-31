import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logoutUser } from "../features/user/userSlice";

export const useHandleLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
    window.location.reload();
  };

  return handleLogout;
};

export const getFormData = (folder, formId) => {
  for (let item of folder) {
    if (!item.isFolder && item._id.toString() === formId.toString()) {
      return item;
    }

    if (item.children?.length > 0) {
      try {
        const form = getFormData(item.children, formId);
        if (form) return form;
      } catch (error) {
        //eat 5start do nothing till last itration
      }
    }
  }

  throw new Error("Form not found");
};

export const links = {
  product: [
    {
      name: "status",
      link: "#",
    },
    {
      name: "documentation",
      link: "#",
    },
    {
      name: "roadmap",
      link: "#",
    },
    {
      name: "pricing",
      link: "#",
    },
  ],
  community: [
    {
      name: "discord",
      link: "#",
    },
    {
      name: "twitter",
      link: "#",
    },
    {
      name: "github",
      link: "#",
    },
    { name: "linkedin", link: "#" },
  ],
  company: [
    {
      name: "about",
      link: "#",
    },
    {
      name: "contact",
      link: "#",
    },
    {
      name: "Terms of Service",
      link: "#",
    },

    {
      name: "Privacy Policy",
      link: "#",
    },
  ],
};
