const BASE_URL = import.meta.env.VITE_API_URL || "";

export const importLocalJobsSources = async () => {
  const response = await fetch(`${BASE_URL}/api/jobs/import-local-sources`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("שגיאה בייבוא משרות ממקורות מקומיים");
  }
  return await response.json();
};

export const importCuratedLocalFeed = async () => {
  const response = await fetch(`${BASE_URL}/api/jobs/import-curated-local-feed`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("שגיאה בייבוא ממאגר החיצוני");
  }
  return await response.json();
};

export default { importLocalJobsSources, importCuratedLocalFeed };
