import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import PreLoader from "./../components/PreLoader";
import toast from "react-hot-toast";
import { shareSpace } from "../utils/AxiosRequest";

const AddSpace = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const userToken = localStorage.getItem("token");

  const handleShareSpace = async () => {

    if (!userToken) {
      toast.error("User is not logged in!");
      return navigate("/login");
    }

    const token = searchParams.get("token");
    if (!token) {
      toast.error("Invalid link!");
      return navigate("/404");
    }

    try {
      const res = await shareSpace({}, token);

      if (res && res.success) {
        toast.success("Access granted!");
        return navigate("/");
      } else {
        toast.error(res?.message || "Failed to access space.");
        return navigate("/");
      }
    } catch (error) {
      toast.error(
        error.message || "An unexpected error occurred. Please try again."
      );
      navigate("/");
    }
  };

  useEffect(() => {
    handleShareSpace(); 
  }, []);

  return <PreLoader />; 
};

export default AddSpace;
