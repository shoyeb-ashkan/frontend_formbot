import axios from "axios";

const backendUrl = import.meta.env.VITE_API_URL;

export const getFormData = async (formId) => {
  try {
    const response = await axios.get(
      `${backendUrl}/api/v1/space/form/${formId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response?.data;
  } catch (error) {
    let errorMessage = "An unexpected error occurred";
    if (error.response) {
      errorMessage = error?.response?.data?.message || errorMessage;
    } else if (error.request) {
      errorMessage = "Network error. Please try again.";
    } else {
      errorMessage = "Error: " + error.message;
    }
    return { error: true, message: errorMessage };
  }
};

export const updateFormResponse = async (formId, formData) => {
  console.log(formData);
  try {
    const response = await axios.put(
      `${backendUrl}/api/v1/space/form/${formId}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);
    return response?.data;
  } catch (error) {
    let errorMessage = "An unexpected error occurred";
    if (error.response) {
      errorMessage = error?.response?.data?.message || errorMessage;
    } else if (error.request) {
      errorMessage = "Network error. Please try again.";
    } else {
      errorMessage = "Error: " + error.message;
    }
    return { error: true, message: errorMessage };
  }
};

export const generateShareLink = async (spaceId, accessType) => {
  try {
    const response = await axios.get(
      `${backendUrl}/api/v1/user/generate-invite`,
      {
        params: { spaceId, access: accessType },
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return response?.data;
  } catch (error) {
    let errorMessage = "An unexpected error occurred";
    if (error.response) {
      errorMessage = error?.response?.data?.message || errorMessage;
    } else if (error.request) {
      errorMessage = "Network error. Please try again.";
    } else {
      errorMessage = "Error: " + error.message;
    }
    return { error: true, message: errorMessage };
  }
};

export const shareSpace = async ({ spaceId, accessType, email }, token) => {
  try {
    const url = token
      ? `${backendUrl}/api/v1/user/sharespace?token=${token}`
      : `${backendUrl}/api/v1/user/sharespace`;
    const response = await axios.put(
      url,
      { spaceId, accessType, email },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return response?.data;
  } catch (error) {
    let errorMessage = "An unexpected error occurred";
    if (error.response) {
      errorMessage = error?.response?.data?.message || errorMessage;
    } else if (error.request) {
      errorMessage = "Network error. Please try again.";
    } else {
      errorMessage = "Error: " + error.message;
    }
    return { error: true, message: errorMessage };
  }
};
