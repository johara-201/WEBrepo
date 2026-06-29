//This file checks if the user or admin is allowed to access protected routes

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "beit-hakerem-secret-2024";

//Check if the request comes from a logged-in user
function requireUser(req, res, next) {

  //Get the token from the request header
  const auth = req.headers.authorization;

  //Make sure the token exists and has the correct format
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "לא מורשה" });
  }

  try {

    //Verify the token and read its data
    const decoded = jwt.verify(auth.split(" ")[1], JWT_SECRET);

    //Allow access only for regular users
    if (decoded.type !== "user")
      return res.status(403).json({ error: "אין הרשאה" });

    //Save the user ID for the next route
    req.userId = decoded.id;

    //Continue to the requested route
    next();
  } catch {

    //Return an error if the token is not valid
    return res.status(401).json({ error: "Token לא תקין" });
  }
}

//Check if the request comes from an admin
function requireAdmin(req, res, next) {

  //Get the token from the request header
  const auth = req.headers.authorization;

  //Make sure the token exists and has the correct format
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "לא מורשה" });
  }

  try {

    //Verify the token and read its data
    const decoded = jwt.verify(auth.split(" ")[1], JWT_SECRET);

    //Allow access only for admins
    if (decoded.type !== "admin")
      return res.status(403).json({ error: "אין הרשאה" });

    //Save admin information for later use
    req.adminId = decoded.id;
    req.adminRole = decoded.role;
    req.canSeeAll = decoded.canSeeAll;

    //Continue to the requested route
    next();
  } catch {

    //Return an error if the token is not valid
    return res.status(401).json({ error: "Token לא תקין" });
  }
}

//Check if the admin is a super admin
function requireSuper(req, res, next) {

  //First, make sure the user is an admin
  requireAdmin(req, res, () => {

    //Allow only admins with full permissions
    if (!req.canSeeAll) {
      return res.status(403).json({ error: "נדרשת הרשאת מנהל ראשי" });
    }

    //Continue to the requested route
    next();
  });
}

//Export all middleware functions
module.exports = { requireUser, requireAdmin, requireSuper };