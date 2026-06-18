import axios from "axios";

export const createJob = async (jobData) => {
  const response = await axios.post("/api/jobs", jobData);
  return response.data;
};
