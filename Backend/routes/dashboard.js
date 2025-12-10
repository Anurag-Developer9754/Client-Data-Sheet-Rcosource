import express from "express";
import fs from "fs";
import csv from "csvtojson";
import path from "path";

const router = express.Router();

// Convert strings like "₹4,285.71" → 4285.71
function parseAmount(amount) {
  if (!amount) return 0;
  return Number(amount.replace(/[^0-9.-]+/g, ""));
}

router.get("/", async (req, res) => {
  try {
    const month = req.query.month;

    if (!month) {
      return res.status(400).json({ error: "Please provide month in query" });
    }

    const __dirname = path.resolve();
    const filePath = path.join(__dirname, "uploads", `${month}.csv`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: `${month}.csv file not found` });
    }

    // LOAD CSV
    const jsonArray = await csv().fromFile(filePath);

    let totalOrders = 0;
    let totalRevenue = 0;

    const dayWise = {};
    const stateWise = {};
    const skuWise = {};

    jsonArray.forEach((row) => {
      // 🔥 Convert all column names to lowercase
      const normalized = {};
      Object.keys(row).forEach((key) => {
        normalized[key.trim().toLowerCase()] = row[key];
      });

      const type = normalized["type"]?.trim().toLowerCase();
      const sku = normalized["sku"]?.trim();
      const state = normalized["order state"]?.trim();

      const dateRaw =
        normalized["date/time"] ||
        normalized["order date"] ||
        normalized["date"];

      const totalStr =
        normalized["total"] ||
        normalized["total s"] ||
        normalized["total amount"] ||
        normalized["amount"];

      // WE ONLY WANT order rows
      if (type !== "order") return;

      if (!sku) return;

      const total = parseAmount(totalStr);
      const date = dateRaw?.split(" ")[0];

      totalOrders++;
      totalRevenue += total;

      // ---------------- DAY WISE ----------------
      if (!dayWise[date]) dayWise[date] = { orders: 0, revenue: 0 };
      dayWise[date].orders++;
      dayWise[date].revenue += total;

      // ---------------- STATE WISE ----------------
      if (state) {
        if (!stateWise[state]) stateWise[state] = { orders: 0, revenue: 0 };
        stateWise[state].orders++;
        stateWise[state].revenue += total;
      }

      // ---------------- SKU WISE ----------------
      if (!skuWise[sku]) skuWise[sku] = { orders: 0, revenue: 0 };
      skuWise[sku].orders++;
      skuWise[sku].revenue += total;
    });

    // DAY GRAPH
    const graph = Object.keys(dayWise).map((date) => ({
      month: date,
      orders: dayWise[date].orders,
      revenue: Number(dayWise[date].revenue.toFixed(2)),
    }));

    // STATE GRAPH
    const stateGraph = Object.keys(stateWise).map((st) => ({
      state: st,
      orders: stateWise[st].orders,
      revenue: Number(stateWise[st].revenue.toFixed(2)),
    }));

    // ---------- SKU GRAPH AUTO TOP N ----------
    const totalSkus = Object.keys(skuWise).length;

    const limit =
      totalSkus > 100
        ? 100
        : totalSkus > 50
        ? 50
        : totalSkus > 25
        ? 25
        : totalSkus; // if 10 SKUs, show 10

    const skuGraph = Object.keys(skuWise)
      .map((s) => ({
        sku: s,
        orders: skuWise[s].orders,
        revenue: Number(skuWise[s].revenue.toFixed(2)),
      }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, limit);

    res.json({
      stats: {
        orders: totalOrders,
        revenue: Number(totalRevenue.toFixed(2)),
      },
      graph,
      stateGraph,
      skuGraph,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

export default router;
