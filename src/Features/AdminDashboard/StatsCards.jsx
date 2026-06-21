function StatsCards({ jobs }) {
  const totalJobs = jobs.length;
  const manualJobs = jobs.filter((job) => job.source === "manual").length;
  const externalJobs = jobs.filter((job) => job.isExternal).length;
  const studentJobs = jobs.filter((job) => job.suitableForStudents).length;

  const cards = [
    { title: "סה״כ משרות", value: totalJobs },
    { title: "פרסומים עצמאיים", value: manualJobs },
    { title: "משרות חיצוניות", value: externalJobs },
    { title: "מתאימות לסטודנטים", value: studentJobs },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm text-gray-500">{card.title}</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;