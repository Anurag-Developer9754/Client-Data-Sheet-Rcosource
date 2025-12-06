import csv from "csv-parser";
import fs from "fs";
import path from "path";

export const getDashboardData = async (req, res) => {
  try {
    const filePath = path.join("uploads", "november.csv");

    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        try {
          const rawDate = row["Date"];
          const type = row["Type"];
          const totalValue = row["Total"];

          if (!rawDate || !type || !totalValue) return;

          const dateOnly = rawDate.split(" ")[0];
          const numberValue = Number(String(totalValue).replace(/,/g, ""));

          if (type === "Order") {
            results.push({
              date: dateOnly,
              total: numberValue,
            });
          }
        } catch {}
      })
      .on("end", () => {
        const dailyTotals = {};

        results.forEach((item) => {
          if (!dailyTotals[item.date]) {
            dailyTotals[item.date] = 0;
          }
          dailyTotals[item.date] += item.total;
        });

        const graph = Object.keys(dailyTotals).map((date) => ({
          date,
          total: dailyTotals[date],
        }));

        res.json({
          stats: {
            users: 0,
            orders: graph.length,
            revenue: graph.reduce((a, b) => a + b.total, 0),
          },
          graph,
        });
      });
  } catch (err) {
    res.status(500).json({ error: "Error reading CSV" });
  }
};
