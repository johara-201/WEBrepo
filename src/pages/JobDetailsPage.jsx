import { getJobById } from "../services/JobsService";
import ApplicationForm from "../components/ApplicationForm";

function JobDetailsPage({ jobId, goToHome }) {
  const job = getJobById(jobId);

  if (!job) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-bold text-red-600">
          המשרה לא נמצאה
        </h2>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <button
        onClick={goToHome}
        className="mb-6 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
      >
        חזרה למשרות
      </button>

      <h2 className="text-3xl font-bold text-green-700 mb-6">
        {job.title}
      </h2>

      <div className="space-y-3 text-gray-700">
        <p>
          <strong>יישוב:</strong> {job.village}
        </p>

        <p>
          <strong>תחום:</strong> {job.field}
        </p>

        <p>
          <strong>השכלה נדרשת:</strong> {job.education}
        </p>

        <p>
          <strong>ניסיון:</strong> {job.experience}
        </p>

        <p>
          <strong>תיאור התפקיד:</strong> {job.description}
        </p>

        <p>
          <strong>איש קשר:</strong> {job.contact}
        </p>

        <p>
          <strong>מקור פרסום:</strong> {job.source}
        </p>
      </div>

      <div className="mt-10 border-t pt-8">
        <ApplicationForm />
      </div>
    </div>
  );
}

export default JobDetailsPage;