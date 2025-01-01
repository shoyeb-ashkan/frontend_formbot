import { useNavigate, useSearchParams } from "react-router-dom";
import PreLoader from "./../components/PreLoader";
import toast from "react-hot-toast";
import { shareSpace } from "../utils/AxiosRequest";
import { useEffect } from "react";

const AddSpace = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userToken = localStorage.getItem("token");


  //to add space using link shared by owner of space
  const handleShareSpace = async () => {
    // if user is not logged in redirect to login page
    if (!userToken) {
      toast.error("User is not logged in!");
      return navigate("/login");
    }

    // get token from the link shared 
    const token = searchParams.get("token");
    if (!token) {
      toast.error("Invalid link!");
      return navigate("/404");
    }

    try {
      // share send the request to backend to add space
      const res = await shareSpace({}, token);

      if (res && res.success) {
        // success or not redirect to home from where user will be fetched again 
        toast.success("Access granted!");
        navigate("/");
      } else {
        toast.error(res?.message || "Failed to access space.");
        navigate("/");
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
