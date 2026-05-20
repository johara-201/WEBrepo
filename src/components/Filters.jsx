function Filters({ filters, setFilters }) {
  return (
    <>
      <select
        value={filters.village}
        onChange={(event) =>
          setFilters({
            ...filters,
            village: event.target.value,
          })
        }
        className="border rounded-lg px-4 py-3"
      >
        <option value="all">כל היישובים</option>
        <option value="כרמיאל">כרמיאל</option>
        <option value="מג'ד אל כרום">מג'ד אל כרום</option>
        <option value="נחף">נחף</option>
        <option value="דיר אל אסד">דיר אל אסד</option>
      </select>

      <select
        value={filters.field}
        onChange={(event) =>
          setFilters({
            ...filters,
            field: event.target.value,
          })
        }
        className="border rounded-lg px-4 py-3"
      >
        <option value="all">כל התחומים</option>
        <option value="נוער">נוער</option>
        <option value="קהילה">קהילה</option>
        <option value="הדרכה">הדרכה</option>
        <option value="ספורט">ספורט</option>
      </select>

      <select
        value={filters.education}
        onChange={(event) =>
          setFilters({
            ...filters,
            education: event.target.value,
          })
        }
        className="border rounded-lg px-4 py-3"
      >
        <option value="all">כל רמות ההשכלה</option>
        <option value="ללא דרישה אקדמית">ללא דרישה אקדמית</option>
        <option value="סטודנט/ית">סטודנט/ית</option>
        <option value="תואר ראשון">תואר ראשון</option>
      </select>

      <select
        value={filters.experience}
        onChange={(event) =>
          setFilters({
            ...filters,
            experience: event.target.value,
          })
        }
        className="border rounded-lg px-4 py-3"
      >
        <option value="all">כל רמות הניסיון</option>
        <option value="ללא ניסיון">ללא ניסיון</option>
        <option value="ניסיון בסיסי">ניסיון בסיסי</option>
        <option value="ניסיון מקצועי">ניסיון מקצועי</option>
      </select>
    </>
  );
}

export default Filters;