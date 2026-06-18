import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "";

export const getExternalJobs = async () => {
  const response = await axios.get(`${BASE_URL}/api/jobs`);
  return response.data;
};

export default { getExternalJobs };