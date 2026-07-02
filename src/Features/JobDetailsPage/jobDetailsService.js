import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "";

export const getJobById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/jobs/${id}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.data ||
      error.message ||
      "שגיאה בטעינת המשרה";
    throw new Error(message);
  }
};

export async function updateApplication(applicationId, formData, token) {
  const data = new FormData();

  data.append("fullName", formData.fullName || "");
  data.append("email", formData.email || "");
  data.append("phone", formData.phone || "");
  data.append("message", formData.message || "");

  if (formData.resumeFile) {
    data.append("resumeFile", formData.resumeFile);
  }

  try {
    const res = await fetch(`${BASE_URL}/api/applications/${applicationId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(result.error || "שגיאה בעדכון המועמדות");
    }

    return result;
  } catch (error) {
    throw error instanceof Error ? error : new Error("שגיאה בעדכון המועמדות");
  }
}
