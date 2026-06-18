import { useEffect, useState } from "react";
import { getAllApplications } from "./adminService";

function ViewApplications({ onClose }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllApplications();
        setApplications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 pt-12" dir="rtl">
      <div className="mb-12 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            מועמדויות שהתקבלו ({applications.length})
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {loading && <p className="py-8 text-center text-gray-500">טוען מועמדויות...</p>}

        {!loading && applications.length === 0 && (
          <p className="py-8 text-center text-gray-500">עדיין לא התקבלו מועמדויות.</p>
        )}

        {!loading && applications.length > 0 && (
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app._id} className="rounded-xl border border-stone-200 p-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-semibold text-gray-800">{app.fullName}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(app.submittedAt).toLocaleDateString("he-IL")}
                  </span>
                </div>
                <p className="text-sm text-[#2f6b46] mb-1">{app.jobTitle}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>📧 {app.email}</span>
                  {app.phone && <span>📞 {app.phone}</span>}
                </div>
                {app.message && (
                  <p className="mt-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-700 italic">
                    "{app.message}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewApplications;
