import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "";

export const getJobs = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/jobs`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.data ||
      error.message ||
      "שגיאה בטעינת המשרות";
    throw new Error(message);
  }
};
