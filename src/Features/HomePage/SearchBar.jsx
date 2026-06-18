function SearchBar({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-full p-1.5 shadow-lg">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="חיפוש לפי תפקיד, רשות או תיאור..."
        className="flex-1 bg-transparent px-4 py-2 text-right text-gray-800 focus:outline-none"
      />
      <button className="whitespace-nowrap rounded-full bg-[#2f6b46] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#245539]">
        🔍 חפש משרות
      </button>
    </div>
  );
}

export default SearchBar;