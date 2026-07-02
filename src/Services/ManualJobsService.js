import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const createManualJob = async (jobData) => {
  const response = await axios.post(`${BASE_URL}/api/jobs`, jobData, {
    headers: authHeaders(),
  });
  return response.data;
};