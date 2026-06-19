import logoImg from "../assets/logo.png";

function NavBar({ activePage, onHome, onSearch, onAbout, onFaq, onAdmin }) {
  const links = [
    { label: "דף הבית",       key: "home",   fn: onHome   },
    { label: "חיפוש משרות",   key: "search", fn: onSearch },
    { label: "אודות",          key: "about",  fn: onAbout  },
    { label: "שאלות ותשובות", key: "faq",    fn: onFaq    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        <button onClick={onHome}>
          <img src={logoImg} alt="אשכול בית הכרם" className="h-14 w-auto" />
        </button>

        <nav className="hidden md:flex items-center gap-7">
          {links.map(({ label, key, fn }) => (
            <button
              key={key}
              onClick={fn}
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

        <button
          onClick={onAdmin}
          className="text-sm font-semibold border-2 border-[#2f6b46] text-[#2f6b46] hover:bg-[#2f6b46] hover:text-white px-5 py-2 rounded-xl transition"
        >
          התחברות
        </button>
      </div>
    </header>
  );
}

export default NavBar;
