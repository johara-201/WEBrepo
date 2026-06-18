import { useState } from "react";
import { createManualJob } from "../../Services/ManualJobsService";

function PostJobPage({ onBack }) {
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    city: "",
    jobType: "",
    employmentPercent: "",
    distanceMinutes: "",
    suitableForStudents: false,
    description: "",
    applyUrl: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const jobToSend = {
    ...formData,
    employmentPercent: Number(formData.employmentPercent),
    distanceMinutes: Number(formData.distanceMinutes),
    source: "manual",
    sourceName: "פרסום עצמאי",
    publishDate: new Date(),
  };

  try {
    await createManualJob(jobToSend);
    alert("המשרה נשמרה בהצלחה");
    onBack();
  } catch (error) {
    console.error(error);
    alert("אירעה שגיאה בשמירת המשרה");
  }
};

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={onBack}
          className="mb-6 text-blue-600 hover:text-blue-800"
        >
          ← חזרה
        </button>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-2xl font-bold text-gray-800">
            פרסום משרה חדשה
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="title"
              placeholder="שם המשרה"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            />

            <input
              name="organization"
              placeholder="ארגון מגייס"
              value={formData.organization}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            />

            <input
              name="city"
              placeholder="יישוב"
              value={formData.city}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            />

            <input
              name="jobType"
              placeholder="סוג תפקיד"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            />

            <input
              name="employmentPercent"
              type="number"
              placeholder="אחוז משרה"
              value={formData.employmentPercent}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            />

            <input
              name="distanceMinutes"
              type="number"
              placeholder="מרחק נסיעה בדקות"
              value={formData.distanceMinutes}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            />

            <textarea
              name="description"
              placeholder="תיאור המשרה"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="w-full rounded-lg border p-3"
            />

            <input
              name="applyUrl"
              placeholder="קישור להגשת מועמדות"
              value={formData.applyUrl}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="suitableForStudents"
                checked={formData.suitableForStudents}
                onChange={handleChange}
              />
              מתאים לסטודנטים
            </label>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
            >
              פרסם משרה
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostJobPage;