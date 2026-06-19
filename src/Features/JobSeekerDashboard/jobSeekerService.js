const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

function headers(token) {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export async function getProfile(token) {
  const res = await fetch(`${API}/api/users/me`, { headers: headers(token) });
  if (!res.ok) throw new Error("שגיאה בטעינת פרופיל");
  return res.json();
}

export async function updateProfile(token, data) {
  const res = await fetch(`${API}/api/users/me`, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("שגיאה בעדכון פרופיל");
  return res.json();
}

export async function uploadCV(token, file) {
  const form = new FormData();
  form.append("cv", file);
  const res = await fetch(`${API}/api/users/me/cv`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "שגיאה בהעלאת קורות חיים");
  }
  return res.json();
}

export async function deleteCV(token) {
  const res = await fetch(`${API}/api/users/me/cv`, {
    method: "DELETE",
    headers: headers(token),
  });
  if (!res.ok) throw new Error("שגיאה במחיקת קורות חיים");
  return res.json();
}

export function getCVUrl(token) {
  return `${API}/api/users/me/cv`;
}

export async function getMyApplications(token) {
  const res = await fetch(`${API}/api/applications/my`, { headers: headers(token) });
  if (!res.ok) throw new Error("שגיאה בטעינת מועמדויות");
  return res.json();
}

export async function withdrawApplication(token, appId) {
  const res = await fetch(`${API}/api/applications/${appId}`, {
    method: "DELETE",
    headers: headers(token),
  });
  if (!res.ok) throw new Error("שגיאה בהסרת מועמדות");
}

export async function changePassword(token, data) {
  const res = await fetch(`${API}/api/users/me/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(result.error || "שגיאה בשינוי הסיסמה");
  }

  return result;
}