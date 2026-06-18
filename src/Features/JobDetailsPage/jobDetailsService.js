import axios from "axios";

export const getJobById = async (id) => {
  const response = await axios.get(`/api/jobs/${id}`);
  return response.data;
};
