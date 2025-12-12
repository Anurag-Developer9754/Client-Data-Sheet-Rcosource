import shopify from "../shopify.js";

export async function getSkuWiseGraph(req, res) {
  try {
    const client = new shopify.api.clients.Graphql({ session: res.locals.shopify.session });

    const query = `
      {
        orders(first: 100) {
          edges {
            node {
              id
              createdAt
              lineItems(first: 50) {
                edges {
                  node {
                    sku
                    quantity
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await client.query({ data: query });

    const edges = response.body.data.orders.edges;

    const skuCount = {};

    edges.forEach(order => {
      order.node.lineItems.edges.forEach(item => {
        const sku = item.node.sku || "NO SKU";
        const qty = item.node.quantity;

        if (!skuCount[sku]) skuCount[sku] = 0;
        skuCount[sku] += qty;
      });
    });

    const graphArray = Object.keys(skuCount).map(key => ({
      sku: key,
      quantity: skuCount[key]
    }));

    res.json({
      success: true,
      graph: graphArray
    });

  } catch (error) {
    console.error("SKU GRAPH ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
