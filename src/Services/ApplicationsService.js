import axios from "axios";

export const submitApplication = async (applicationData) => {
  const response = await axios.post("/api/applications", applicationData);
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

export const deleteApplication = async (id) => {
  const response = await axios.delete(`/api/applications/${id}`);
  return response.data;
};
