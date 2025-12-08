// import express from "express";
// import cors from "cors";
// import multer from "multer";
// import csv from "csvtojson";
// import dashboardRoute from "./routes/dashboard.js";
// import authRoutes from "./routes/authRoutes.js";   // <-- ADD THIS

// const app = express();

// app.use(cors());
// app.use(express.json());

// // File upload setup
// const upload = multer({ dest: "uploads/" });

// // Test API
// app.get("/api/transactions", (req, res) => {
//   res.json({ message: "API Connected Successfully!" });
// });

// // Upload CSV API
// app.post("/api/upload", upload.single("file"), async (req, res) => {
//   try {
//     const jsonArray = await csv().fromFile(req.file.path);

//     res.json({
//       status: "success",
//       rows: jsonArray.length,
//       data: jsonArray,
//     });
//   } catch (error) {
//     res.status(500).json({ error: "CSV Parse Error" });
//   }
// });

// // USE AUTH ROUTES  ✔✔✔
// app.use("/api/auth", authRoutes);

// // CONNECT DASHBOARD ROUTE ✔
// app.use("/api/dashboard", dashboardRoute);

// app.listen(5000, () => console.log("Server running on port 5000"));


// ===============================
//         IMPORTS
// ===============================


import express from "express";
import cors from "cors";
import multer from "multer";
import csv from "csvtojson";
import dotenv from "dotenv";
import mongoose from "mongoose";

import dashboardRoute from "./routes/dashboard.js";
import authRoutes from "./routes/authRoutes.js";

// ===============================
//   LOAD ENV FILE (.env)
// ===============================
dotenv.config();

// Check if env loaded
console.log("Loaded MONGO_URI =", process.env.MONGO_URI);

// ===============================
//       CONNECT MONGODB
// ===============================
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// ===============================
//       EXPRESS APP SETUP
// ===============================
const app = express();
app.use(cors());
app.use(express.json());

// ===============================
//     MULTER UPLOAD SETUP
// ===============================
const upload = multer({ dest: "uploads/" });

// ===============================
//        TEST API
// ===============================
app.get("/api/transactions", (req, res) => {
  res.json({ message: "API Connected Successfully!" });
});

// ===============================
//        CSV UPLOAD API
// ===============================
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const jsonArray = await csv().fromFile(req.file.path);

    res.json({
      status: "success",
      rows: jsonArray.length,
      data: jsonArray,
    });
  } catch (error) {
    res.status(500).json({ error: "CSV Parse Error" });
  }
});

// ===============================
//         AUTH ROUTES
// ===============================
app.use("/api/auth", authRoutes);

// ===============================
//       DASHBOARD ROUTES
// ===============================
app.use("/api/dashboard", dashboardRoute);

// ===============================
//        START SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
