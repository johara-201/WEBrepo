import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "";

export const submitApplication = async (applicationData) => {
  const response = await axios.post(`${BASE_URL}/api/applications`, applicationData);
  return response.data;
};

export const getAllApplications = async () => {
  const response = await axios.get(`${BASE_URL}/api/applications`);
  return response.data;
};

export const getApplicationsByJob = async (jobId) => {
  const response = await axios.get(`${BASE_URL}/api/applications/job/${jobId}`);
  return response.data;
};

export const deleteApplication = async (id) => {
  const response = await axios.delete(`${BASE_URL}/api/applications/${id}`);
  return response.data;
};