function DeleteConfirm({ jobTitle, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" dir="rtl">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center">
        <div className="mb-4 text-4xl">🗑️</div>
        <h2 className="mb-2 text-lg font-bold text-gray-800">מחיקת משרה</h2>
        <p className="mb-6 text-sm text-gray-600">
          האם אתה בטוח שברצונך למחוק את המשרה{" "}
          <span className="font-semibold">"{jobTitle}"</span>?
          <br />
          פעולה זו אינה ניתנת לביטול.
        </p>
        <div className="flex justify-center gap-3">
          <button onClick={onCancel}
            className="rounded-lg border px-5 py-2 text-sm text-gray-600 hover:bg-gray-50">
            ביטול
          </button>
          <button onClick={onConfirm}
            className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700">
            מחק משרה
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirm;
