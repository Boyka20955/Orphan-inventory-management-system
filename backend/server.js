const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const childRoutes = require("./routes/child.routes");
const healthRecordRoutes = require("./routes/healthRecord.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const donationRoutes = require("./routes/donation.routes");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/Orphan-Management-System";

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/children", childRoutes);
app.use("/api/health-records", healthRecordRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/donations", donationRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("Orphanage Management System API is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
