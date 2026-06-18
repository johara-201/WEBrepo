import axios from "axios";

export const getJobs = async () => {
  const response = await axios.get("/api/jobs");   // ← פנייה לשרת
  return response.data;
};