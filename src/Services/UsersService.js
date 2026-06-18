// שירות משתמשים - מוכן להרחבה עתידית
// כרגע אין Backend לניהול משתמשים, אבל המבנה כאן לשימוש עתידי

export const ADMIN_PASSWORD = "admin123"; // בסביבת ייצור - להחליף בפתרון אמיתי

export const checkAdminPassword = (password) => {
  return password === ADMIN_PASSWORD;
};
