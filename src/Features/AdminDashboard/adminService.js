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

export const updateJob = async (id, jobData) => {
  const response = await axios.put(
    `${BASE_URL}/api/jobs/${id}`,
    jobData,
    authConfig()
  );
  return response.data;
};

export const deleteJob = async (id) => {
  const response = await axios.delete(
    `${BASE_URL}/api/jobs/${id}`,
    authConfig()
  );
  return response.data;
};

export const getAllApplications = async () => {
  const response = await axios.get(
    `${BASE_URL}/api/applications`,
    authConfig()
  );
  return response.data;
};

export const getApplicationsByJob = async (jobId) => {
  const response = await axios.get(
    `${BASE_URL}/api/applications/job/${jobId}`,
    authConfig()
  );
  return response.data;
};