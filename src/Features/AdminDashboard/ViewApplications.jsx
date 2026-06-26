import { useEffect, useState } from "react";
import { getAllApplications } from "./adminService";

function ViewApplications({ onClose }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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

  const activeApplications = applications.filter(
    (app) => !app.cancelledByUser && !app.jobRemoved
  );

  const cancelledApplications = applications.filter(
    (app) => app.cancelledByUser
  );

  const removedApplications = applications.filter(
    (app) => app.jobRemoved
  );

  const filteredApplications = applications.filter((app) => {
    if (filter === "active") return !app.cancelledByUser && !app.jobRemoved;
    if (filter === "cancelled") return app.cancelledByUser;
    if (filter === "removed") return app.jobRemoved;
    return true;
  });

  const filterButtons = [
    { key: "all", label: "הכל", count: applications.length },
    { key: "active", label: "פעילות", count: activeApplications.length },
    { key: "cancelled", label: "בוטלו", count: cancelledApplications.length },
    { key: "removed", label: "משרות שנמחקו", count: removedApplications.length },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 pt-12"
      dir="rtl"
    >
      <div className="mb-12 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            מועמדויות שהתקבלו ({applications.length})

            {cancelledApplications.length > 0 && (
              <span className="mr-2 text-sm font-normal text-red-400">
                {cancelledApplications.length} בוטלו
              </span>
            )}

            {removedApplications.length > 0 && (
              <span className="mr-2 text-sm font-normal text-orange-500">
                {removedApplications.length} נמחקו
              </span>
            )}
          </h2>

          <button
            onClick={onClose}
            className="text-xl text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {filterButtons.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                filter === item.key
                  ? "bg-[#2f6b46] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {item.label} ({item.count})
            </button>
          ))}
        </div>

        {loading && (
          <p className="py-8 text-center text-gray-500">
            טוען מועמדויות...
          </p>
        )}

        {!loading && filteredApplications.length === 0 && (
          <p className="py-8 text-center text-gray-500">
            אין מועמדויות להצגה בסינון הנוכחי.
          </p>
        )}

        {!loading && filteredApplications.length > 0 && (
          <div className="space-y-3">
            {filteredApplications.map((app) => (
              <div
                key={app._id}
                className={`rounded-xl border p-4 ${
                  app.cancelledByUser
                    ? "border-red-200 bg-red-50/50"
                    : app.jobRemoved
                    ? "border-orange-200 bg-orange-50/60"
                    : "border-stone-200"
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`font-semibold ${
                        app.cancelledByUser
                          ? "text-gray-400 line-through"
                          : "text-gray-800"
                      }`}
                    >
                      {app.fullName}
                    </span>

                    {app.cancelledByUser && (
                      <span className="rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-600">
                        ביטל מועמדות
                      </span>
                    )}

                    {app.jobRemoved && (
                      <span className="rounded-full border border-orange-200 bg-orange-100 px-2 py-0.5 text-[11px] font-bold text-orange-700">
                        משרה נמחקה
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-gray-400">
                    {new Date(app.submittedAt).toLocaleDateString("he-IL")}
                  </span>
                </div>

                <p
                  className={`mb-1 text-sm ${
                    app.cancelledByUser
                      ? "text-gray-400"
                      : app.jobRemoved
                      ? "text-orange-700"
                      : "text-[#2f6b46]"
                  }`}
                >
                  {app.jobTitle}
                </p>

                {app.jobRemoved && (
                  <p className="mb-2 text-xs font-semibold text-orange-700">
                    המשרה נמחקה ואינה זמינה יותר באתר.
                  </p>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span>📧 {app.email}</span>
                  {app.phone && <span>📞 {app.phone}</span>}
                </div>

                {app.cancelledByUser && app.cancelledAt && (
                  <p className="mt-1 text-xs text-red-400">
                    בוטל ב־
                    {new Date(app.cancelledAt).toLocaleDateString("he-IL")}
                  </p>
                )}

                {app.message && !app.cancelledByUser && (
                  <p className="mt-2 rounded-lg bg-gray-50 p-3 text-sm italic text-gray-700">
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