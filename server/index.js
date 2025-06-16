const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const auth = require("./middleware/auth");

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// WebSocket connection handling
wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    // Handle different types of messages
    switch (data.type) {
      case "subscribe":
        // Handle subscription to specific channels
        break;
      case "unsubscribe":
        // Handle unsubscription
        break;
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Broadcast function to send updates to all connected clients
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Make broadcast function available globally
app.set("broadcast", broadcast);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/auth_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Public Routes
app.use("/api/auth", authRoutes);

// Protected Routes
app.use("/api/dashboard", dashboardRoutes);

// Protected User Profile Route
app.get("/api/user/profile", auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        name: req.user.name,
        email: req.user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile" });
  }
});

// Add more protected routes here as needed

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
