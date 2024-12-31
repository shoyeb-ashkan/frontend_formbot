import { useEffect, useState } from "react";
import "./styles/shareSpace.css";
import Loading from "./Loading";
import { generateShareLink, shareSpace } from "../utils/AxiosRequest";
import toast from "react-hot-toast";

const ShareSpace = ({ spaceId, setShowShare, ownerEmail }) => {
  const [accessType, setAccessType] = useState("view");
  const [copylinkLoading, setCopylinkLoading] = useState(false);
  const [addEmailLoading, setAddEmailLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleOutsideClick = (event) => {
    const modalContainer = document.querySelector(".share__space__container");
    if (!modalContainer.contains(event.target)) {
      setShowShare(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Please enter an email address.");
    }

    if (email.toLowerCase() === ownerEmail.toLowerCase()) {
      return toast.error("You cannot share with yourself!");
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return toast.error("Please enter a valid email address.");
    }

    setAddEmailLoading(true);
    const res = await shareSpace({ spaceId, accessType, email });
    setAddEmailLoading(false);

    if (res && res?.success) {
      toast.success("Space shared successfully!");
      setShowShare(false);
    } else {
      toast.error(res?.message || "Failed to share space.");
    }
  };

  const handleCopyLink = async (e) => {
    e.preventDefault();
    try {
      setCopylinkLoading(true);

      // Generate the share link
      const res = await generateShareLink(spaceId, accessType);
      if (res && res.success) {
        const shareableLink = `${window.location.origin}/space/share?token=${res.data.token}`;
        await navigator.clipboard.writeText(shareableLink);
        toast.success("Link copied to clipboard!");
        setTimeout(() => {
          toast(() => (
            <span>
              ⚠️ The link will be active for <b>1 hour</b>.
            </span>
          ));
        }, 500);
      } else {
        toast.error(res?.message || "Failed to generate the link.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setCopylinkLoading(false); // Ensure loading state is cleared
    }
  };

  return (
    <div className="share__space__container">
      <div className="share__space__email">
        <div className="share__space__email__header">
          <p>Invite by Email</p>
          <select
            onChange={(e) => setAccessType(e.target.value)}
            value={accessType}
          >
            <option value="view">View</option>
            <option value="edit">Edit</option>
          </select>
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email id"
        />
        <button onClick={(e) => handleSubmit(e)}>
          {addEmailLoading ? <Loading /> : "Send Invite"}
        </button>
      </div>
      <div className="share__space__link">
        <p>Invite by link</p>
        <button
          disabled={copylinkLoading}
          className={copylinkLoading ? "disabled" : ""}
          onClick={(e) => handleCopyLink(e)}
        >
          {copylinkLoading ? <Loading /> : "Copy Link"}
        </button>
      </div>
    </div>
  );
};
export default ShareSpace;
