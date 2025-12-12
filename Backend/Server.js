import express from "express";
import cors from "cors";
import multer from "multer";
import csv from "csvtojson";
import dotenv from "dotenv";
import mongoose from "mongoose";

import dashboardRoute from "./routes/dashboard.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

// ===============================
// CONNECT MONGO
// ===============================
mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Error:", err));

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// MULTER STORAGE (FINAL FIX)
// ===============================
// Yahan file ORIGINAL NAME se save hogi → January.csv, February.csv...
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);  // 👈 EXACT FIX: Undefined.csv problem solved
  },
});

const upload = multer({ storage });

// ===============================
// CSV UPLOAD API
// ===============================
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.json({
      status: "success",
      filename: req.file.originalname,
      message: `${req.file.originalname} uploaded successfully`,
    });
  } catch (e) {
    return res.status(500).json({ error: "CSV upload failed" });
  }
});

// ===============================
// ROUTES
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoute);

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
