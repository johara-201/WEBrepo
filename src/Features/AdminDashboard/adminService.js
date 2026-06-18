import axios from "axios";

export const updateJob = async (id, jobData) => {
  const response = await axios.put(`/api/jobs/${id}`, jobData);
  return response.data;
};

export const deleteJob = async (id) => {
  const response = await axios.delete(`/api/jobs/${id}`);
  return response.data;
};

export const getAllApplications = async () => {
  const response = await axios.get("/api/applications");
  return response.data;
};

export const getApplicationsByJob = async (jobId) => {
  const response = await axios.get(`/api/applications/job/${jobId}`);
  return response.data;
};
