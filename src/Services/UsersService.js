// Users service - ready for future use
// There is no backend for user management yet, the structure here is for the future

export const ADMIN_PASSWORD = "admin123"; // In production this should be replaced with a real solution

export const checkAdminPassword = (password) => {
  return password === ADMIN_PASSWORD;
};
