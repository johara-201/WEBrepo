function Header({ goToHome, goToAdmin }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-green-700">
            פלטפורמת משרות בחינוך הבלתי פורמלי
          </h1>
          <p className="text-gray-600 mt-1">
            ריכוז משרות, מכרזים והזדמנויות בתחום הנוער במרחב אשכול בית הכרם
          </p>
        </div>

        <nav className="flex gap-3">
          <button
            onClick={goToHome}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            מסך משרות
          </button>

          <button
            onClick={goToAdmin}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            מסך ניהול
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;