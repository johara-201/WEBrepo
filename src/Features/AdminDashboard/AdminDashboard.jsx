import { useEffect, useState } from "react";
import { getJobs } from "../HomePage/homeService";
import { deleteJob } from "./adminService";
import JobsTable from "./JobsTable";
import StatsCards from "./StatsCards";
import EditJobModal from "./EditJobModal";
import DeleteConfirm from "./DeleteConfirm";
import ViewApplications from "./ViewApplications";
import NavBar from "../../Components/NavBar";
import { useAuth } from "../../Context/AuthContext";
import { AdminProfilePanel, AdminsListPanel } from "./AdminManagement";

const SIDEBAR = [
  { key: "dashboard",   label: "לוח בקרה",     emoji: "🏠" },
  { key: "profile",     label: "הפרטים שלי",   emoji: "⚙️" },
  { key: "admins",      label: "ניהול מנהלים", emoji: "👥", superOnly: true },
];

function AdminDashboard({ onBack, onPostJob, onHome, onSearch, onAbout, onFaq }) {
  const { admin, token, logout, isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [jobs,    setJobs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [editingJob,      setEditingJob]      = useState(null);
  const [deletingJob,     setDeletingJob]     = useState(null);
  const [showApplications, setShowApplications] = useState(false);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await getJobs();
      setJobs(data);
      setError("");
    } catch { setError("אירעה שגיאה בטעינת המשרות."); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadJobs(); }, []);

  const handleDeleteConfirm = async () => {
    try {
      await deleteJob(deletingJob._id);
      setDeletingJob(null);
      loadJobs();
    } catch { alert("אירעה שגיאה במחיקה"); }
  };

  const sidebar = SIDEBAR.filter(s => !s.superOnly || isSuperAdmin);

  return (
    <div dir="rtl" className="min-h-screen bg-[#f9f8f4] text-right text-gray-800 font-sans">
      <NavBar activePage="admin" onHome={onHome || onBack} onSearch={onSearch}
        onAbout={onAbout} onFaq={onFaq} onAdmin={() => {}} />

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6 items-start">

        {/* ── Sidebar ── */}
        <aside className="w-52 shrink-0 sticky top-24">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="text-center mb-5 pb-4 border-b border-gray-100">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-2 ${
                isSuperAdmin ? "bg-[#e8e7fc]" : "bg-gray-100"}`}>
                {isSuperAdmin ? "⭐" : "👤"}
              </div>
              <p className="font-bold text-gray-800 text-sm">{admin?.username}</p>
              <p className="text-xs text-gray-400">{isSuperAdmin ? "מנהל ראשי" : "מנהל"}</p>
            </div>
            <nav className="flex flex-col gap-1">
              {sidebar.map(item => (
                <button key={item.key} onClick={() => setActiveTab(item.key)}
                  className={`w-full text-right px-3 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
                    activeTab === item.key
                      ? "bg-[#e8e7fc] text-[#4f46e5] font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <span>{item.emoji}</span> {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-1">
              <button onClick={onPostJob}
                className="w-full text-right px-3 py-2.5 rounded-xl text-sm font-bold text-[#2f6b46] hover:bg-[#e9f5ef] transition flex items-center gap-2">
                <span>➕</span> משרה חדשה
              </button>
              <button onClick={() => setShowApplications(true)}
                className="w-full text-right px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition flex items-center gap-2">
                <span>📋</span> מועמדויות
              </button>
              <button onClick={() => { logout(); onBack(); }}
                className="w-full text-right px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition flex items-center gap-2">
                <span>🚪</span> יציאה
              </button>
            </div>
          </div>
        </aside>

        {/* ── Content ── */}
        <div className="flex-1 min-w-0">
          {/* ── לוח בקרה ── */}
          {activeTab === "dashboard" && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">לוח בקרה</h1>
              {loading && <p className="py-10 text-center text-gray-400">טוען נתונים...</p>}
              {error   && <p className="py-10 text-center text-red-600">{error}</p>}
              {!loading && !error && (
                <>
                  <StatsCards jobs={jobs} />
                  <JobsTable
                    jobs={jobs}
                    onEdit={job => setEditingJob(job)}
                    onDelete={job => setDeletingJob(job)}
                  />
                </>
              )}
            </>
          )}

          {/* ── פרטים אישיים ── */}
          {activeTab === "profile" && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">הפרטים שלי</h1>
              <AdminProfilePanel />
            </>
          )}

          {/* ── ניהול מנהלים (super בלבד) ── */}
          {activeTab === "admins" && isSuperAdmin && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">ניהול מנהלים</h1>
              <AdminsListPanel />
            </>
          )}
        </div>
      </div>

      {editingJob && (
        <EditJobModal job={editingJob} onClose={() => setEditingJob(null)} onSaved={loadJobs} />
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
