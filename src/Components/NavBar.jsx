import logoImg from "../assets/logo.png";
import { useAuth } from "../Context/AuthContext";

function NavBar({ activePage, onHome, onSearch, onAbout, onFaq, onAdmin, onDashboard, onAIChat }) {
  const { user, admin, logout, isUser, isAdmin } = useAuth();
  const handleLogout = () => {
  logout();
  onHome?.();
};

  const links = [
    { label: "דף הבית",       key: "home",   fn: onHome   },
    { label: "חיפוש משרות",   key: "search", fn: onSearch },
    { label: "אודות",          key: "about",  fn: onAbout  },
    { label: "שאלות ותשובות", key: "faq",    fn: onFaq    },
    { label: "צ׳אט AI", key: "aiChat", fn: onAIChat },
  ];

  let rightBtn;
  if (isAdmin) {
    rightBtn = (
      <div className="flex items-center gap-3">
        <button onClick={onAdmin}
          className="text-sm font-semibold text-[#4f46e5] hover:underline">
          {admin?.username} ⭐
        </button>
        <button
          onClick={() => {
            logout();
            onHome();
          }}
          className="text-xs border border-gray-300 text-gray-500 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition"
          >
           יציאה
          </button>
      </div>
    );
  } else if (isUser) {
    rightBtn = (
      <div className="flex items-center gap-3">
        <button onClick={onDashboard}
          className="text-sm font-semibold text-[#2f6b46] hover:underline">
          {user?.name?.split(" ")[0]} 👤
        </button>
        <button
  onClick={handleLogout}
  className="inline-flex items-center gap-1.5 text-xs font-semibold border border-red-200 text-red-600 bg-white px-3 py-1.5 rounded-xl hover:bg-red-50 hover:border-red-300 transition shadow-sm"
>
  <span>🚪</span>
  <span>יציאה</span>
</button>
      </div>
    );
  } else {
    rightBtn = (
      <button onClick={onAdmin}
        className="text-sm font-semibold border-2 border-[#2f6b46] text-[#2f6b46] hover:bg-[#2f6b46] hover:text-white px-5 py-2 rounded-xl transition">
        התחברות
      </button>
    );
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        <button onClick={onHome}>
          <img src={logoImg} alt="אשכול בית הכרם" className="h-14 w-auto" />
        </button>
        <nav className="hidden md:flex items-center gap-7">
          {links.map(({ label, key, fn }) => (
            <button key={key} onClick={fn}
              className={`text-sm font-medium transition ${
                activePage === key
                  ? "text-[#2f6b46] font-bold border-b-2 border-[#2f6b46] pb-0.5"
                  : "text-gray-600 hover:text-[#2f6b46]"
              }`}>
              {label}
            </button>
          ))}
        </nav>
        {rightBtn}
      </div>
    </header>
  );
}

export default NavBar;
