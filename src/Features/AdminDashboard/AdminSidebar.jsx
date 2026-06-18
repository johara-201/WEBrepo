// AdminSidebar - מוכן להרחבה עתידית אם רוצים Sidebar קבועה בדאשבורד
function AdminSidebar({ activePage, onNavigate }) {
  const items = [
    { key: "jobs", label: "🗂️ ניהול משרות" },
    { key: "applications", label: "📋 מועמדויות" },
    { key: "postJob", label: "➕ פרסום משרה" },
  ];

  return (
    <aside className="w-56 min-h-screen bg-[#2f6b46] text-white p-4 flex flex-col gap-2">
      <p className="font-bold text-lg mb-4 px-2">ניהול</p>
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onNavigate(item.key)}
          className={
            "w-full text-right px-3 py-2 rounded-lg text-sm transition " +
            (activePage === item.key
              ? "bg-white/20 font-semibold"
              : "hover:bg-white/10")
          }
        >
          {item.label}
        </button>
      ))}
    </aside>
  );
}

export default AdminSidebar;
