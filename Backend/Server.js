import express from "express";
import cors from "cors";
import multer from "multer";
import csv from "csvtojson";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// ----------------------------------
// MULTER UPLOAD SETUP
// ----------------------------------
const upload = multer({
  dest: "uploads/"
});

// ----------------------------------
// TEST API
// ----------------------------------
app.get("/api/transactions", (req, res) => {
  res.json({ message: "API Connected Successfully!" });
});

// ----------------------------------
// UPLOAD CSV API
// ----------------------------------
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const oldPath = req.file.path;
    const newPath = "uploads/november.csv"; // fixed filename

    // Replace old file
    fs.renameSync(oldPath, newPath);

    const jsonArray = await csv().fromFile(newPath);

    res.json({
      status: "success",
      rows: jsonArray.length,
      data: jsonArray,
      message: "File uploaded & saved as november.csv"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "CSV Parse Error" });
  }
});

// ----------------------------------
// DAY-WISE SALES REPORT API
// ----------------------------------
app.get("/api/daywise-report", async (req, res) => {
  try {
    const filePath = "uploads/november.csv";

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "CSV file not found" });
    }

    const jsonArray = await csv().fromFile(filePath);
    const dayWise = {};

    jsonArray.forEach((row) => {
      const type = row["type"]?.trim();
      const dateRaw = row["date/time"];
      const total = parseFloat(row["total"] || 0);

      if (type !== "Shipping") return;

      const date = dateRaw?.split(" ")[0];

      if (!dayWise[date]) {
        dayWise[date] = 0;
      }

      dayWise[date] += total;
    });

    const finalData = Object.keys(dayWise).map((date) => ({
      date,
      sales: parseFloat(dayWise[date].toFixed(2)),
    }));

    finalData.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      status: "success",
      totalDays: finalData.length,
      data: finalData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Day-wise report error" });
  }
});

// ----------------------------------
// DASHBOARD API (ORDERS + REVENUE)
// ----------------------------------
app.get("/api/dashboard", async (req, res) => {
  try {
    const filePath = "uploads/november.csv";

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "CSV file not found" });
    }

    const jsonArray = await csv().fromFile(filePath);

    let totalOrders = 0;
    let totalRevenue = 0;

    jsonArray.forEach((row) => {
      const type = row["type"]?.trim();
      const total = parseFloat(row["total"] || 0);

      if (type === "Shipping") {
        totalOrders += 1;
        totalRevenue += total;
      }
    });

    res.json({
      status: "success",
      orders: totalOrders,
      revenue: parseFloat(totalRevenue.toFixed(2)),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Dashboard error" });
  }
});

// ----------------------------------
// START SERVER
// ----------------------------------
app.listen(5000, () => console.log("✅ Server running on port 5000"));
