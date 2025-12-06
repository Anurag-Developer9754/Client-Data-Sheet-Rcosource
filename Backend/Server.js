import express from "express";
import cors from "cors";
import multer from "multer";
import csv from "csvtojson";
import dashboardRoute from "./routes/dashboard.js";

const app = express();

app.use(cors());
app.use(express.json());

// File upload setup
const upload = multer({ dest: "uploads/" });

// Test API
app.get("/api/transactions", (req, res) => {
  res.json({ message: "API Connected Successfully!" });
});

// Upload CSV API
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

// CONNECT DASHBOARD ROUTE ✔
app.use("/api/dashboard", dashboardRoute);

app.listen(5000, () => console.log("Server running on port 5000"));

