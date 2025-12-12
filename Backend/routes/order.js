import express from "express";
import axios from "axios";

const router = express.Router();

// Shopify API keys
const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

// GET Orders with SKU mapping
router.get("/orders", async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const ordersResponse = await axios.get(
      `https://${SHOPIFY_STORE}/admin/api/2024-10/orders.json?status=any&limit=${limit}`,
      {
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    const orders = ordersResponse.data.orders;

    let skuGraph = [];

    orders.forEach((order) => {
      order.line_items.forEach((item) => {
        if (item.sku) {
          skuGraph.push({
            sku: item.sku,
            quantity: item.quantity,
            date: order.created_at,
          });
        }
      });
    });

    res.json({
      stats: {
        totalOrders: orders.length,
      },
      graph: orders,
      skuGraph,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
});

export default router;
