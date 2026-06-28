require("dotenv").config();
const express         = require("express");
const cors            = require("cors");
const mongoose        = require("mongoose");
const jobsRouter      = require("./routes/jobs.route");
const applicationsRouter = require("./routes/applications.route");
const authRouter      = require("./routes/auth.route");
const usersRouter     = require("./routes/users.route");
const adminMgmtRouter = require("./routes/adminManagement.route");
const aiRouter = require("./routes/ai.routes");

const http = require("http");
const { WebSocketServer, WebSocket } = require("ws");

const app  = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log("WebSocket client connected");

  socket.send(JSON.stringify({ type: "connected" }));

  socket.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

function broadcastStatsUpdate() {
  const message = JSON.stringify({ type: "statsUpdated" });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

app.set("broadcastStatsUpdate", broadcastStatsUpdate);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("MongoDB connection error:", error));

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static("uploads"));

app.use("/api/jobs",         jobsRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api/auth",         authRouter);
app.use("/api/users",        usersRouter);
app.use("/api/admins",       adminMgmtRouter);
app.use("/api/ai",           aiRouter);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
