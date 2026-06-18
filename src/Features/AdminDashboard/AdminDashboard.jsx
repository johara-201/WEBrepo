import { useEffect, useState } from "react";
import { getJobs } from "../HomePage/homeService";
import { deleteJob } from "./adminService";
import JobsTable from "./JobsTable";
import StatsCards from "./StatsCards";
import EditJobModal from "./EditJobModal";
import DeleteConfirm from "./DeleteConfirm";
import ViewApplications from "./ViewApplications";

function AdminDashboard({ onBack, onPostJob }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingJob, setEditingJob] = useState(null);
  const [deletingJob, setDeletingJob] = useState(null);
  const [showApplications, setShowApplications] = useState(false);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await getJobs();
      setJobs(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("אירעה שגיאה בטעינת המשרות.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleDeleteConfirm = async () => {
    try {
      await deleteJob(deletingJob._id);
      setDeletingJob(null);
      loadJobs();
    } catch (err) {
      console.error(err);
      alert("אירעה שגיאה במחיקה");
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-6 text-right">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">לוח ניהול משרות</h1>
            <p className="mt-1 text-sm text-gray-500">ניהול המשרות במערכת</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowApplications(true)}
              className="rounded-lg border border-[#2f6b46] px-4 py-2 text-[#2f6b46] hover:bg-[#2f6b46] hover:text-white transition text-sm"
            >
              📋 מועמדויות
            </button>
            <button
              onClick={onPostJob}
              className="rounded-lg bg-[#2f6b46] px-4 py-2 text-white hover:bg-[#245539] text-sm"
            >
              + פרסום משרה חדשה
            </button>
            <button
              onClick={onBack}
              className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 text-sm"
            >
              חזרה לאתר
            </button>
          </div>
        </div>

        {loading && <p className="py-10 text-center text-gray-500">טוען נתונים...</p>}
        {error && <p className="py-10 text-center text-red-600">{error}</p>}

        {!loading && !error && (
          <>
            <StatsCards jobs={jobs} />
            <JobsTable
              jobs={jobs}
              onEdit={(job) => setEditingJob(job)}
              onDelete={(job) => setDeletingJob(job)}
            />
          </>
        )}
      </div>

      {editingJob && (
        <EditJobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSaved={loadJobs}
        />
      )}

      {deletingJob && (
        <DeleteConfirm
          jobTitle={deletingJob.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingJob(null)}
        />
      )}

      {showApplications && (
        <ViewApplications onClose={() => setShowApplications(false)} />
      )}
    </div>
  );
}

export default AdminDashboard;