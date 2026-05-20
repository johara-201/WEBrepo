function AdminJobForm() {
  function addJob(event) {
    event.preventDefault();

    alert("המשרה נוספה בהצלחה. זהו מסך הדגמה עם Fake Data.");
  }

  return (
    <div className="border-t pt-6">
      <h3 className="text-xl font-bold mb-4">
        הוספת משרה חדשה
      </h3>

      <form
        onSubmit={addJob}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          placeholder="שם המשרה"
          className="border rounded-lg px-4 py-3"
          required
        />

        <input
          type="text"
          placeholder="יישוב"
          className="border rounded-lg px-4 py-3"
          required
        />

        <input
          type="text"
          placeholder="תחום"
          className="border rounded-lg px-4 py-3"
          required
        />

        <input
          type="text"
          placeholder="השכלה נדרשת"
          className="border rounded-lg px-4 py-3"
        />

        <input
          type="text"
          placeholder="ניסיון נדרש"
          className="border rounded-lg px-4 py-3"
        />

        <input
          type="email"
          placeholder="אימייל איש קשר"
          className="border rounded-lg px-4 py-3"
        />

        <textarea
          placeholder="תיאור המשרה"
          className="md:col-span-2 border rounded-lg px-4 py-3"
          rows="4"
        ></textarea>

        <button
          type="submit"
          className="md:col-span-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
        >
          הוספת משרה
        </button>
      </form>
    </div>
  );
}

export default AdminJobForm;