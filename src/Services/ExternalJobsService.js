import axios from "axios";

const URL = "/api/jobs";

export const getExternalJobs = async () => {
  const response = await axios.get(URL);
  return response.data;
};

export default {
  getExternalJobs,
};