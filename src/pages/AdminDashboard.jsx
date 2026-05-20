import { getAllJobs } from "../services/JobsService";
import AdminJobForm from "../components/AdminJobForm";

function AdminDashboard() {
  const jobs = getAllJobs();

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold text-green-700 mb-2">
          מסך ניהול לרשויות
        </h2>

        <p className="text-gray-600 mb-6">
          מסך ראשוני שמדגים כיצד נציג רשות יכול לראות משרות, סטטוס ומספר מועמדויות.
        </p>

        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse text-right">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border">שם המשרה</th>
                <th className="p-3 border">יישוב</th>
                <th className="p-3 border">תחום</th>
                <th className="p-3 border">סטטוס</th>
                <th className="p-3 border">מועמדויות</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{job.title}</td>
                  <td className="p-3 border">{job.village}</td>
                  <td className="p-3 border">{job.field}</td>
                  <td className="p-3 border">{job.status}</td>
                  <td className="p-3 border">{job.applications}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AdminJobForm />
      </div>
    </div>
  );
}

export default AdminDashboard;