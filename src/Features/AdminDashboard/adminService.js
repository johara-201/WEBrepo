import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "";

export const updateJob = async (id, jobData) => {
  const response = await axios.put(`${BASE_URL}/api/jobs/${id}`, jobData);
  return response.data;
};

export const deleteJob = async (id) => {
  const response = await axios.delete(`${BASE_URL}/api/jobs/${id}`);
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