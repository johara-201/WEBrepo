function ApplicationForm() {
  function submitApplication(event) {
    event.preventDefault();

    alert("המועמדות נשלחה בהצלחה");
  }

  return (
    <div>
      <h3 className="text-2xl font-bold mb-5">
        טופס הגשת מועמדות
      </h3>

      <form
        onSubmit={submitApplication}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          placeholder="שם מלא"
          className="border rounded-lg px-4 py-3"
          required
        />

        <input
          type="email"
          placeholder="אימייל"
          className="border rounded-lg px-4 py-3"
          required
        />

        <input
          type="tel"
          placeholder="טלפון"
          className="border rounded-lg px-4 py-3"
          required
        />

        <input
          type="text"
          placeholder="ניסיון קצר / הערה"
          className="border rounded-lg px-4 py-3"
        />

        <button
          type="submit"
          className="md:col-span-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
        >
          שליחת מועמדות
        </button>
      </form>
    </div>
  );
}

export default ApplicationForm;