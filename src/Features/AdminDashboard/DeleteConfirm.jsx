import { useLanguage } from "../../Context/LanguageContext";

const DELETE_CONFIRM_TEXT = {
  he: {
    title: "מחיקת משרה",
    questionStart: "האם אתה בטוח שברצונך למחוק את המשרה",
    questionEnd: "פעולה זו אינה ניתנת לביטול.",
    cancel: "ביטול",
    delete: "מחק משרה",
  },

  ar: {
    title: "حذف الوظيفة",
    questionStart: "هل أنت متأكد/ة أنك تريد/ين حذف الوظيفة",
    questionEnd: "لا يمكن التراجع عن هذه العملية.",
    cancel: "إلغاء",
    delete: "حذف الوظيفة",
  },
};

function DeleteConfirm({ jobTitle, onConfirm, onCancel }) {
  const { language } = useLanguage();
  const text = DELETE_CONFIRM_TEXT[language] || DELETE_CONFIRM_TEXT.he;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      dir="rtl"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center">
        <div className="mb-4 text-4xl">🗑️</div>

        <h2 className="mb-2 text-lg font-bold text-gray-800">
          {text.title}
        </h2>

        <p className="mb-6 text-sm text-gray-600">
          {text.questionStart}{" "}
          <span className="font-semibold">"{jobTitle}"</span>?
          <br />
          {text.questionEnd}
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border px-5 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            {text.cancel}
          </button>

          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            {text.delete}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirm;