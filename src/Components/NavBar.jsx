import logoImg from "../assets/logo.png";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";
import { useLanguage } from "../Context/LanguageContext";

function NavBar({
  activePage,
  onHome,
  onSearch,
  onAbout,
  onFaq,
  onAdmin,
  onDashboard,
  onAIChat,
}) {
  const { user, admin, logout, isUser, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, toggleLanguage } = useLanguage();

  const handleLogout = () => {
    logout();
    onHome?.();
  };

  const handleLoginClick = () => {
    if (typeof onAdmin === "function") {
      onAdmin();
    } else {
      console.error("onAdmin function is missing in NavBar");
    }
  };

  const links = [
    { label: t.nav.home, key: "home", fn: onHome },
    { label: t.nav.search, key: "search", fn: onSearch },
    { label: t.nav.about, key: "about", fn: onAbout },
    { label: t.nav.faq, key: "faq", fn: onFaq },
    { label: t.nav.aiChat, key: "aiChat", fn: onAIChat },
  ];

  const themeButton = (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle text-xs font-semibold border border-gray-300 text-gray-600 bg-white px-3 py-1.5 rounded-xl hover:bg-gray-50 transition shadow-sm"
    >
      {theme === "dark" ? `☀️ ${t.nav.light}` : `🌙 ${t.nav.dark}`}
    </button>
  );

  const languageButton = (
    <button
      type="button"
      onClick={toggleLanguage}
      className="text-xs font-semibold border border-gray-300 text-gray-600 bg-white px-3 py-1.5 rounded-xl hover:bg-gray-50 transition shadow-sm"
    >
      🌐 {t.nav.switchLanguage}
    </button>
  );

  let rightBtn;

  if (isAdmin) {
    rightBtn = (
      <div className="flex items-center gap-3">
        {themeButton}
        {languageButton}

        <button
          type="button"
          onClick={handleLoginClick}
          className="text-sm font-semibold text-[#4f46e5] hover:underline"
        >
          {admin?.username} ⭐
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="text-xs border border-gray-300 text-gray-500 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition"
        >
          {t.nav.logout}
        </button>
      </div>
    );
  } else if (isUser) {
    rightBtn = (
      <div className="flex items-center gap-3">
        {themeButton}
        {languageButton}

        <button
          type="button"
          onClick={() => onDashboard?.()}
          className="text-sm font-semibold text-[#2f6b46] hover:underline"
        >
          {user?.name?.split(" ")[0]} 👤
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 text-xs font-semibold border border-red-200 text-red-600 bg-white px-3 py-1.5 rounded-xl hover:bg-red-50 hover:border-red-300 transition shadow-sm"
        >
          <span>🚪</span>
          <span>{t.nav.logout}</span>
        </button>
      </div>
    );
  } else {
    rightBtn = (
      <div className="flex items-center gap-3">
        {themeButton}
        {languageButton}

        <button
          type="button"
          onClick={handleLoginClick}
          className="text-sm font-semibold border-2 border-[#2f6b46] text-[#2f6b46] hover:bg-[#2f6b46] hover:text-white px-5 py-2 rounded-xl transition"
        >
          {t.nav.login}
        </button>
      </div>
    );
  }

  return (
    <header className="app-header sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        <button type="button" onClick={() => onHome?.()}>
          <img
            src={logoImg}
            alt={t.home.heroTitle}
            className="h-14 w-auto"
          />
        </button>

        <nav className="hidden md:flex items-center gap-7">
          {links.map(({ label, key, fn }) => (
            <button
              key={key}
              type="button"
              onClick={() => fn?.()}
              className={`text-sm font-medium transition ${
                activePage === key
                  ? "text-[#2f6b46] font-bold border-b-2 border-[#2f6b46] pb-0.5"
                  : "text-gray-600 hover:text-[#2f6b46]"
              }`}
            >
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