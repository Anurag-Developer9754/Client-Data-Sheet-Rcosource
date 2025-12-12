import express from "express";
import fs from "fs";
import csv from "csvtojson";
import path from "path";
import { protect } from "../middleware/authMiddleware.js"; 

const router = express.Router();

// Convert ₹4,285.71 (or "4,285.71") -> 4285.71
function parseAmount(amount) {
  if (!amount && amount !== 0) return 0;
  try {
    return Number(String(amount).replace(/[^0-9.-]+/g, ""));
  } catch (err) {
    return 0;
  }
}

// Protected route -> only logged in users can access their own files
router.get("/", protect, async (req, res) => {
  try {
    const month = req.query.month; // e.g. "January"
    if (!month) {
      return res.status(400).json({ error: "Please provide month in query (e.g. ?month=January)" });
    }

    // Determine client folder from logged-in user
    // NOTE: This assumes req.user.name === folder name under uploads (e.g. "Client One")
    const clientFolder = req.user?.name;
    if (!clientFolder) {
      return res.status(400).json({ error: "Client folder not found for this user" });
    }

    const __dirname = path.resolve();
    const filePath = path.join(__dirname, "uploads", clientFolder, `${month}.csv`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: `${month}.csv not found for client ${clientFolder}`, path: filePath });
    }

    // Read CSV as JSON array
    const jsonArray = await csv().fromFile(filePath);

    let totalOrders = 0;
    let totalRevenue = 0;

    const dayWise = {};   // date -> {orders, revenue}
    const stateWise = {}; // state -> {orders, revenue}
    const skuWise = {};   // sku -> {orders, revenue}

    jsonArray.forEach((row) => {
      // Normalize keys to lowercase trimmed names (covers different CSV headings)
      const normalized = {};
      Object.keys(row).forEach((k) => {
        normalized[k.trim().toLowerCase()] = row[k];
      });

      const type = (normalized["type"] || "").toString().trim().toLowerCase();
      if (type !== "order") return; // only process orders

      const dateRaw = normalized["date/time"] || normalized["order date"] || normalized["date"] || "";
      const date = dateRaw.split(" ")[0] || "unknown";

      const state = (normalized["order state"] || normalized["state"] || normalized["shipping state"] || "").toString().trim();
      const sku = (normalized["sku"] || normalized["item sku"] || normalized["product sku"] || "").toString().trim();
      const totalStr = normalized["total"] || normalized["total s"] || normalized["total amount"] || normalized["amount"] || "0";
      const total = parseAmount(totalStr);

      // Totals
      totalOrders++;
      totalRevenue += total;

      // Day wise
      if (!dayWise[date]) dayWise[date] = { orders: 0, revenue: 0 };
      dayWise[date].orders++;
      dayWise[date].revenue += total;

      // State wise
      if (state) {
        if (!stateWise[state]) stateWise[state] = { orders: 0, revenue: 0 };
        stateWise[state].orders++;
        stateWise[state].revenue += total;
      }

      // SKU wise
      if (sku) {
        if (!skuWise[sku]) skuWise[sku] = { orders: 0, revenue: 0 };
        skuWise[sku].orders++;
        skuWise[sku].revenue += total;
      }
    });

    // Convert to arrays for charts
    const graph = Object.keys(dayWise).map((d) => ({
      month: d,
      orders: dayWise[d].orders,
      revenue: Number(dayWise[d].revenue.toFixed(2)),
    }));

    const stateGraph = Object.keys(stateWise).map((s) => ({
      state: s,
      orders: stateWise[s].orders,
      revenue: Number(stateWise[s].revenue.toFixed(2)),
    }));

    // SKU: sort by orders desc, slice top N. Automatically choose N: up to 100 for big clients.
    const totalSkus = Object.keys(skuWise).length;
    const limit = totalSkus > 100 ? 100 : totalSkus > 50 ? 50 : totalSkus > 25 ? 25 : totalSkus;

    const skuGraph = Object.keys(skuWise)
      .map((k) => ({ sku: k, orders: skuWise[k].orders, revenue: Number(skuWise[k].revenue.toFixed(2)) }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, limit);

    res.json({
      stats: { orders: totalOrders, revenue: Number(totalRevenue.toFixed(2)) },
      graph,
      stateGraph,
      skuGraph,
    });
  } catch (err) {
    console.error("Dashboard route error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

export default router;
