import { useEffect, useState } from "react";
import { deleteJob, getAdminJobs } from "./adminService";
import { useToast } from "../../Components/Toast";
import JobsTable from "./JobsTable";
import StatsCards from "./StatsCards";
import EditJobModal from "./EditJobModal";
import DeleteConfirm from "./DeleteConfirm";
import ViewApplications from "./ViewApplications";
import NavBar from "../../Components/NavBar";
import { useAuth } from "../../Context/AuthContext";
import { useLanguage } from "../../Context/LanguageContext";
import { AdminProfilePanel, AdminsListPanel } from "./AdminManagement";
import { importLocalJobsSources, importCuratedLocalFeed } from "../../Services/ExternalJobsService";

const ADMIN_TEXT = {
  he: {
    sidebar: {
      dashboard: "לוח בקרה",
      profile: "הפרטים שלי",
      admins: "ניהול מנהלים",
      newJob: "משרה חדשה",
      applications: "מועמדויות",
      importLocal: "ייבוא משרות ממקורות מקומיים",
      importCurated: "ייבוא משרות אמיתיות ממאגר חיצוני",
      importing: "מייבא...",
      logout: "יציאה",
      mainAdmin: "מנהל ראשי",
      admin: "מנהל",
    },
    titles: {
      dashboard: "לוח בקרה",
      profile: "הפרטים שלי",
      admins: "ניהול מנהלים",
    },
    messages: {
      loading: "טוען נתונים...",
      loadError: "אירעה שגיאה בטעינת המשרות.",
      deleteError: "אירעה שגיאה במחיקה",
      importLocalSuccess: (count) =>
        count > 0
          ? `✅ יובאו ${count} משרות חיצוניות אמיתיות ממקור API. מקורות מקומיים דורשים בדיקה ידנית.`
          : "✅ לא נמצאו משרות רלוונטיות. מקורות מקומיים דורשים בדיקה ידנית.",
      importLocalError: "❌ שגיאה בייבוא משרות ממקורות מקומיים",
      importCuratedSuccess: (count) =>
        `✅ יובאו ${count} משרות אמיתיות ממאגר חיצוני`,
      importCuratedError: "❌ שגיאה בייבוא ממאגר החיצוני",
    },
  },

  ar: {
    sidebar: {
      dashboard: "لوحة التحكم",
      profile: "بياناتي",
      admins: "إدارة المديرين",
      newJob: "وظيفة جديدة",
      applications: "طلبات التقديم",
      importLocal: "استيراد وظائف من مصادر محلية",
      importCurated: "استيراد وظائف حقيقية من مصدر خارجي",
      importing: "جارٍ الاستيراد...",
      logout: "تسجيل الخروج",
      mainAdmin: "مدير رئيسي",
      admin: "مدير",
    },
    titles: {
      dashboard: "لوحة التحكم",
      profile: "بياناتي",
      admins: "إدارة المديرين",
    },
    messages: {
      loading: "جارٍ تحميل البيانات...",
      loadError: "حدث خطأ أثناء تحميل الوظائف.",
      deleteError: "حدث خطأ أثناء الحذف",
      importLocalSuccess: (count) =>
        count > 0
          ? `✅ تم استيراد ${count} وظائف خارجية حقيقية من مصدر API. المصادر المحلية تتطلب فحصًا يدويًا.`
          : "✅ لم يتم العثور على وظائف ملائمة. المصادر المحلية تتطلب فحصًا يدويًا.",
      importLocalError: "❌ حدث خطأ أثناء استيراد الوظائف من المصادر المحلية",
      importCuratedSuccess: (count) =>
        `✅ تم استيراد ${count} وظائف حقيقية من مصدر خارجي`,
      importCuratedError: "❌ حدث خطأ أثناء الاستيراد من المصدر الخارجي",
    },
  },
};

function AdminDashboard({
  onBack,
  onPostJob,
  onHome,
  onSearch,
  onAbout,
  onFaq,
  onAIChat,
}) {
  const { admin, token, logout, isSuperAdmin } = useAuth();
  const { language } = useLanguage();
  const showToast = useToast();

  const text = ADMIN_TEXT[language] || ADMIN_TEXT.he;

  const [activeTab, setActiveTab] = useState("dashboard");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingJob, setEditingJob] = useState(null);
  const [deletingJob, setDeletingJob] = useState(null);
  const [showApplications, setShowApplications] = useState(false);

  const [importingLocal, setImportingLocal] = useState(false);
  const [importLocalMsg, setImportLocalMsg] = useState("");

  const [importingCurated, setImportingCurated] = useState(false);
  const [importCuratedMsg, setImportCuratedMsg] = useState("");

  const sidebarItems = [
    {
      key: "dashboard",
      label: text.sidebar.dashboard,
      emoji: "🏠",
    },
    {
      key: "profile",
      label: text.sidebar.profile,
      emoji: "⚙️",
    },
    {
      key: "admins",
      label: text.sidebar.admins,
      emoji: "👥",
      superOnly: true,
    },
  ].filter((item) => !item.superOnly || isSuperAdmin);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await getAdminJobs();
      setJobs(data);
      setError("");
    } catch {
      setError(text.messages.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [language]);

  const handleDeleteConfirm = async () => {
    try {
      await deleteJob(deletingJob._id);

      setDeletingJob(null);
      loadJobs();
    } catch {
      showToast(text.messages.deleteError, "error");
    }
  };

  const handleImportLocalSources = async () => {
    try {
      setImportingLocal(true);
      setImportLocalMsg("");

      const result = await importLocalJobsSources();

      setImportLocalMsg(text.messages.importLocalSuccess(result.imported));
      loadJobs();
    } catch {
      setImportLocalMsg(text.messages.importLocalError);
    } finally {
      setImportingLocal(false);
    }
  };

  const handleImportCuratedFeed = async () => {
    try {
      setImportingCurated(true);
      setImportCuratedMsg("");

      const result = await importCuratedLocalFeed();

      setImportCuratedMsg(text.messages.importCuratedSuccess(result.imported));
      loadJobs();
    } catch {
      setImportCuratedMsg(text.messages.importCuratedError);
    } finally {
      setImportingCurated(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#f9f8f4] text-right text-gray-800 font-sans">
      <NavBar
        activePage="admin"
        onHome={onHome || onBack}
        onSearch={onSearch}
        onAbout={onAbout}
        onFaq={onFaq}
        onAdmin={() => {}}
        onAIChat={onAIChat}
      />

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6 items-start">
        <aside className="w-52 shrink-0 sticky top-24">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="text-center mb-5 pb-4 border-b border-gray-100">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-2 ${
                  isSuperAdmin ? "bg-[#e8e7fc]" : "bg-gray-100"
                }`}
              >
                {isSuperAdmin ? "⭐" : "👤"}
              </div>

              <p className="font-bold text-gray-800 text-sm">
                {admin?.username}
              </p>

              <p className="text-xs text-gray-400">
                {isSuperAdmin ? text.sidebar.mainAdmin : text.sidebar.admin}
              </p>
            </div>

            <nav className="flex flex-col gap-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full text-right px-3 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
                    activeTab === item.key
                      ? "bg-[#e8e7fc] text-[#4f46e5] font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>{item.emoji}</span>
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-1">
              <button
                onClick={onPostJob}
                className="w-full text-right px-3 py-2.5 rounded-xl text-sm font-bold text-[#2f6b46] hover:bg-[#e9f5ef] transition flex items-center gap-2"
              >
                <span>➕</span>
                {text.sidebar.newJob}
              </button>

              <button
                onClick={() => setShowApplications(true)}
                className="w-full text-right px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
              >
                <span>📋</span>
                {text.sidebar.applications}
              </button>

              <button
                onClick={handleImportLocalSources}
                disabled={importingLocal}
                className="w-full text-right px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition flex items-center gap-2 disabled:opacity-50"
              >
                <span>🌐</span>
                {importingLocal ? text.sidebar.importing : text.sidebar.importLocal}
              </button>

              <button
                onClick={handleImportCuratedFeed}
                disabled={importingCurated}
                className="w-full text-right px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition flex items-center gap-2 disabled:opacity-50"
              >
                <span>📥</span>
                {importingCurated ? text.sidebar.importing : text.sidebar.importCurated}
              </button>

              <button
                onClick={() => {
                  logout();
                  onBack();
                }}
                className="w-full text-right px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition flex items-center gap-2"
              >
                <span>🚪</span>
                {text.sidebar.logout}
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {activeTab === "dashboard" && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                {text.titles.dashboard}
              </h1>

              {importLocalMsg && (
                <p className="mb-2 text-sm font-medium text-gray-700">
                  {importLocalMsg}
                </p>
              )}

              {importCuratedMsg && (
                <p className="mb-4 text-sm font-medium text-gray-700">
                  {importCuratedMsg}
                </p>
              )}

              {loading && (
                <p className="py-10 text-center text-gray-400">
                  {text.messages.loading}
                </p>
              )}

              {error && (
                <p className="py-10 text-center text-red-600">
                  {error}
                </p>
              )}

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
            </>
          )}

          {activeTab === "profile" && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                {text.titles.profile}
              </h1>

              <AdminProfilePanel />
            </>
          )}

          {activeTab === "admins" && isSuperAdmin && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                {text.titles.admins}
              </h1>

              <AdminsListPanel />
            </>
          )}
        </div>
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