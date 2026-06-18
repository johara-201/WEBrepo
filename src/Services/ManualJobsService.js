import axios from "axios";

export const createManualJob = async (jobData) => {
  const response = await axios.post("/api/jobs", jobData);
  return response.data;
};