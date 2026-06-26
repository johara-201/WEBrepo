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

  const visibleApplications = applications.filter(
  (app) => !app.jobRemoved && !app.cancelledByUser
);

const cancelledApplications = applications.filter(
  (app) => app.cancelledByUser
);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 pt-12" dir="rtl">
      <div className="mb-12 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            מועמדויות שהתקבלו ({visibleApplications.length})
              {cancelledApplications.length > 0 && (
                <span className="mr-2 text-sm font-normal text-red-400">
{cancelledApplications.length} בוטלו              </span>
            )}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {loading && <p className="py-8 text-center text-gray-500">טוען מועמדויות...</p>}

{!loading && visibleApplications.length === 0 && (          <p className="py-8 text-center text-gray-500">עדיין לא התקבלו מועמדויות.</p>
        )}

{!loading && visibleApplications.length > 0 && (          <div className="space-y-3">
{visibleApplications.map((app) => (              <div key={app._id} className={`rounded-xl border p-4 ${app.cancelledByUser ? "border-red-200 bg-red-50/50" : "border-stone-200"}`}>
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-semibold ${app.cancelledByUser ? "text-gray-400 line-through" : "text-gray-800"}`}>{app.fullName}</span>
                    {app.cancelledByUser && (
                      <span className="text-[11px] font-bold text-red-600 bg-red-100 border border-red-200 px-2 py-0.5 rounded-full">
                        ביטל מועמדות
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(app.submittedAt).toLocaleDateString("he-IL")}
                  </span>
                </div>
                <p className={`text-sm mb-1 ${app.cancelledByUser ? "text-gray-400" : "text-[#2f6b46]"}`}>{app.jobTitle}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span>📧 {app.email}</span>
                  {app.phone && <span>📞 {app.phone}</span>}
                </div>
                {app.cancelledByUser && app.cancelledAt && (
                  <p className="mt-1 text-xs text-red-400">
                    בוטל ב־{new Date(app.cancelledAt).toLocaleDateString("he-IL")}
                  </p>
                )}
                {app.message && !app.cancelledByUser && (
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
