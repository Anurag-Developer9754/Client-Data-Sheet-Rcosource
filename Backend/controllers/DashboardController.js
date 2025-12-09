import csv from "csv-parser";
import fs from "fs";
import path from "path";

export const getDashboardData = async (req, res) => {
  try {
    const month = req.query.month; // January, February, etc.

    if (!month) {
      return res.status(400).json({ error: "Month is required" });
    }

    const __dirname = path.resolve();
    const filePath = path.join(__dirname, "uploads", `${month}.csv`);

    // console.log("Looking for file:", filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: `${month}.csv file not found` });
    }

    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        results.push(row);
      })
      .on("end", () => {
        res.json({ data: results });
      });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
