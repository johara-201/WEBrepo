require("dotenv").config();
const express         = require("express");
const cors            = require("cors");
const mongoose        = require("mongoose");
const jobsRouter      = require("./routes/jobs.route");
const applicationsRouter = require("./routes/applications.route");
const authRouter      = require("./routes/auth.route");
const usersRouter     = require("./routes/users.route");
const adminMgmtRouter = require("./routes/adminManagement.route");

const app  = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("MongoDB connection error:", error));

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api/jobs",         jobsRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api/auth",         authRouter);
app.use("/api/users",        usersRouter);
app.use("/api/admins",       adminMgmtRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
