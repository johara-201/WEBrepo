//This file starts the server and connects all server parts

require("dotenv").config();

const express = require("express");
const cors = require("cors"); 
const mongoose = require("mongoose");

//Import all route files
const jobsRouter = require("./routes/jobs.route");
const applicationsRouter = require("./routes/applications.route");
const authRouter = require("./routes/auth.route");
const usersRouter = require("./routes/users.route");
const adminMgmtRouter = require("./routes/adminManagement.route");
const aiRouter = require("./routes/ai.routes");

const http = require("http");
const { WebSocketServer, WebSocket } = require("ws");

const app = express();
const PORT = process.env.PORT || 3000;

//Create an HTTP server for Express
const server = http.createServer(app);

//Create the WebSocket server
const wss = new WebSocketServer({ server });

//Listen for new WebSocket connections
wss.on("connection", (socket) => {
  console.log("WebSocket client connected");

  //Send a message when the client connects
  socket.send(JSON.stringify({ type: "connected" }));

  //Listen for client disconnection
  socket.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

//Send updated statistics to all connected clients
function broadcastStatsUpdate() {
  const message = JSON.stringify({ type: "statsUpdated" });

  //Send the message only to connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

//Make this function available in other files
app.set("broadcastStatsUpdate", broadcastStatsUpdate);

//Connect the server to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("MongoDB connection error:", error));

//Allow requests from different origins
app.use(cors());

//Read JSON data from requests
app.use(express.json({ limit: "10mb" }));

//Register all API routes
app.use("/api/jobs", jobsRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/admins", adminMgmtRouter);
app.use("/api/ai", aiRouter);

//Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});