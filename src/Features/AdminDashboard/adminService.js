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

export const updateJob = async (id, jobData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/jobs/${id}`,
      jobData,
      authConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(extractError(error, "שגיאה בעדכון המשרה"));
  }
};

export const deleteJob = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/jobs/${id}`,
      authConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(extractError(error, "שגיאה במחיקת המשרה"));
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

export const getAdminJobs = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/jobs/admin/list`,
      authConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error(extractError(error, "שגיאה בטעינת משרות המנהל"));
  }
};
