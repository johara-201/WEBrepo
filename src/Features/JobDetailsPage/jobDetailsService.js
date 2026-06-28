import axios from "axios";

export const getJobById = async (id) => {
  const response = await axios.get(`/api/jobs/${id}`);
  return response.data;
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

  const res = await fetch(`${API}/api/applications/${applicationId}`, {
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
}