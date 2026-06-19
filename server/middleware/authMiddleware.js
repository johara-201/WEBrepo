const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "beit-hakerem-secret-2024";

// Middleware למחפשי עבודה
function requireUser(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "לא מורשה" });
  }
  try {
    const decoded = jwt.verify(auth.split(" ")[1], JWT_SECRET);
    if (decoded.type !== "user") return res.status(403).json({ error: "אין הרשאה" });
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ error: "Token לא תקין" });
  }
}

// Middleware למנהלים
function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "לא מורשה" });
  }
  try {
    const decoded = jwt.verify(auth.split(" ")[1], JWT_SECRET);
    if (decoded.type !== "admin") return res.status(403).json({ error: "אין הרשאה" });
    req.adminId   = decoded.id;
    req.adminRole = decoded.role;
    req.canSeeAll = decoded.canSeeAll;
    next();
  } catch {
    return res.status(401).json({ error: "Token לא תקין" });
  }
}

// Middleware לsuper admin בלבד
function requireSuper(req, res, next) {
  requireAdmin(req, res, () => {
    if (!req.canSeeAll) {
      return res.status(403).json({ error: "נדרשת הרשאת מנהל ראשי" });
    }
    next();
  });
}

module.exports = { requireUser, requireAdmin, requireSuper };
