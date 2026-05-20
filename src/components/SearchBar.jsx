function SearchBar({ filters, setFilters }) {
  return (
    <input
      type="text"
      placeholder="חיפוש לפי שם משרה..."
      value={filters.search}
      onChange={(event) =>
        setFilters({
          ...filters,
          search: event.target.value,
        })
      }
      className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  );
}

export default SearchBar;