import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "";

const authConfig = () => {
  const token = localStorage.getItem("token");

  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

function extractError(error, fallback) {
  return (
    error.response?.data?.error ||
    error.response?.data ||
    error.message ||
    fallback
  );
}

export const submitApplication = async (applicationData) => {
  const formData = new FormData();

  Object.keys(applicationData).forEach((key) => {
    if (applicationData[key] !== null && applicationData[key] !== undefined) {
      formData.append(key, applicationData[key]);
    }
  });

  try {
    const response = await axios.post(
      `${BASE_URL}/api/applications`,
      formData,
      { headers: { ...authConfig().headers } }
    );
    return response.data;
  } catch (error) {
    throw error.response?.status === 409
      ? error
      : new Error(extractError(error, "שגיאה בשליחת המועמדות"));
  }
};

export const getAllApplications = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/applications`,
      authConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(extractError(error, "שגיאה בטעינת המועמדויות"));
  }
};

export const getApplicationsByJob = async (jobId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/applications/job/${jobId}`,
      authConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(extractError(error, "שגיאה בטעינת מועמדויות למשרה"));
  }
};

export const deleteApplication = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/applications/${id}`,
      authConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(extractError(error, "שגיאה במחיקת המועמדות"));
  }
};

export const updateApplication = async (id, applicationData) => {
  const formData = new FormData();

  Object.keys(applicationData).forEach((key) => {
    if (applicationData[key] !== null && applicationData[key] !== undefined) {
      formData.append(key, applicationData[key]);
    }
  });

  try {
    const response = await axios.put(
      `${BASE_URL}/api/applications/${id}`,
      formData,
      { headers: { ...authConfig().headers } }
    );
    return response.data;
  } catch (error) {
    throw new Error(extractError(error, "שגיאה בעדכון המועמדות"));
  }
};

export const autoApplyToJob = async (jobId, preferredLanguage = "he") => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/applications/auto/${jobId}`,
      { preferredLanguage },
      authConfig()
    );
    return response.data;
  } catch (error) {
    // Preserve original axios error for 400/409 so callers can check status
    if (error.response?.status === 400 || error.response?.status === 409) {
      throw error;
    }
    throw new Error(extractError(error, "שגיאה בהגשה אוטומטית"));
  }
};
