const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Sample test route
app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "Backend running on Vercel" });
});

const authRoutes = require("../backend/routes/authRoutes");
const productsRoutes = require("../backend/routes/productsRoutes");
const ordersRoutes = require("../backend/routes/ordersRoutes");
const settingsRoutes = require("../backend/routes/settingsRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/settings", settingsRoutes);


module.exports = app;
