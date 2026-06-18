import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "";

export const createManualJob = async (jobData) => {
  const response = await axios.post(`${BASE_URL}/api/jobs`, jobData);
  return response.data;
};