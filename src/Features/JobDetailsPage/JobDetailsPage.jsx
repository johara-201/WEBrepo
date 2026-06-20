import { useState } from "react";
import ApplicationForm from "./ApplicationForm";
import NavBar from "../../Components/NavBar";

function JobDetailsPage({ job, onBack, onHome, onSearch, onAbout, onFaq, onAdmin, onDashboard }) {
  const [showForm, setShowForm] = useState(false);

  if (!job) {
    return (
      <div dir="rtl" className="p-6 text-center">
        <p>לא נמצאה משרה.</p>
      </div>
    );
  }

  const hasApplyUrl = job.applyUrl && job.applyUrl.trim() !== "";

  return (
    <div dir="rtl" className="min-h-screen bg-[#f6f5ef] text-right">
      <NavBar
        activePage="details"
        onHome={onHome}
        onSearch={onSearch}
        onAbout={onAbout}
        onFaq={onFaq}
        onAdmin={onAdmin}
        onDashboard={onDashboard}
      />
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <button onClick={onBack} className="text-sm text-[#2f6b46] hover:underline">
          ← חזרה לכל המשרות
        </button>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h1 className="mb-1 text-2xl font-extrabold text-gray-800">{job.title}</h1>
          <p className="mb-5 text-base font-medium text-[#2f6b46]">{job.organization}</p>

          <div className="mb-6 flex flex-wrap gap-2">
            {job.city && <span className="rounded-full bg-stone-100 px-3 py-1 text-sm text-gray-700">📍 {job.city}</span>}
            {job.jobType && <span className="rounded-full bg-stone-100 px-3 py-1 text-sm text-gray-700">{job.jobType}</span>}
            {job.employmentPercent && <span className="rounded-full bg-stone-100 px-3 py-1 text-sm text-gray-700">{job.employmentPercent}% משרה</span>}
            {job.distanceMinutes && <span className="rounded-full bg-stone-100 px-3 py-1 text-sm text-gray-700">עד {job.distanceMinutes} דק' נסיעה</span>}
            {job.suitableForStudents && <span className="rounded-full bg-[#e9f1ea] px-3 py-1 text-sm text-[#2f6b46]">מתאים לסטודנטים</span>}
          </div>

          <div className="mb-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-800">תיאור התפקיד</h2>
            <p className="leading-8 text-gray-700">{job.description}</p>
          </div>

          {job.sourceName && (
            <div className="mb-6 rounded-xl bg-stone-50 p-4 text-sm text-gray-600">
              <span className="font-medium">מקור: </span>
              {job.source === "manual" ? "פרסום עצמאי" : job.sourceName}
              {hasApplyUrl && (
                <a href={job.applyUrl} target="_blank" rel="noopener noreferrer"
                  className="mr-3 text-[#2f6b46] hover:underline">
                  פתיחת מקור המקורי ↗
                </a>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            {hasApplyUrl && (
              <a href={job.applyUrl} target="_blank" rel="noopener noreferrer"
                className="rounded-lg border border-[#2f6b46] px-6 py-3 text-center text-sm font-medium text-[#2f6b46] transition hover:bg-[#e9f1ea]">
                הגשה באתר המקור
              </a>
            )}
            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-[#2f6b46] px-6 py-3 font-medium text-white transition hover:bg-[#245539]"
            >
              הגשת מועמדות דרך המערכת
            </button>
          </div>
        </div>
      </main>

      {showForm && <ApplicationForm job={job} onClose={() => setShowForm(false)} />}
    </div>
  );
}

export default JobDetailsPage;