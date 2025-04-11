app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  const lower = message.toLowerCase();

  // Greetings
  if (
    ["hi", "hello", "hey"].some((greet) => lower.includes(greet)) ||
    lower.includes("help")
  ) {
    return res.json({
      reply:
        "👋 Hello! I can help you with:\n\n- 📦 Placing an order (e.g., *Order iPhone*)\n- 🔍 Searching products (e.g., *Search fridge*)\n- 🚚 Tracking orders (e.g., *Where is my order?*)\n- ❌ Cancelling orders (e.g., *Cancel iPhone*)\n- 📁 Browsing categories (e.g., *Show categories*)",
    });
  }

  // Ask for user ID
  if (lower.includes("where is my order")) {
    return res.json({
      reply: "📦 Please provide your user ID to fetch your order status.",
    });
  }

  // View Orders
  if (lower.startsWith("user")) {
    const userId = message.trim();
    const userOrders = orders[userId];
    if (userOrders && userOrders.length > 0) {
      const reply = userOrders
        .map(
          (order, i) =>
            `#${i + 1}: **${order.product}** from **${order.company}**\n🛍️ Price: ₹${order.price}\n📦 Status: ${order.status}\n📅 Delivery: ${order.expectedDelivery}`
        )
        .join("\n\n");
      return res.json({ reply });
    } else {
      return res.json({ reply: "❌ No order history found for this user ID." });
    }
  }

  // Place an order
  if (lower.startsWith("order")) {
    const keyword = message.split(" ").slice(1).join(" ").toLowerCase();
    let foundProduct;
    for (const [key, data] of Object.entries(datasets)) {
      foundProduct = data.find((item) =>
        item.product.toLowerCase().includes(keyword)
      );
      if (foundProduct) break;
    }

    if (foundProduct) {
      const userId = "user123";
      if (!orders[userId]) orders[userId] = [];

      const newOrder = {
        product: foundProduct.product,
        company: foundProduct.company || foundProduct.brand || foundProduct.author,
        price: foundProduct.price,
        image: foundProduct.image,
        status: "Order Placed",
        expectedDelivery: "April 15, 2025",
      };

      orders[userId].push(newOrder);
      return res.json({
        reply: `✅ Order Placed Successfully!\n\n🛍️ **${newOrder.product}**\n🏢 Company: ${newOrder.company}\n💰 Price: ₹${newOrder.price}\n📦 Status: ${newOrder.status}\n📅 Delivery: ${newOrder.expectedDelivery}`,
      });
    }

    return res.json({
      reply:
        "❌ Sorry, I couldn’t find that product. Please try again with a different name or check spelling.",
    });
  }

  // Cancel an order
  if (lower.startsWith("cancel")) {
    const keyword = lower.split(" ").slice(1).join(" ");
    const userId = "user123";

    if (orders[userId]) {
      const index = orders[userId].findIndex((o) =>
        o.product.toLowerCase().includes(keyword)
      );

      if (index !== -1) {
        const canceled = orders[userId][index];
        orders[userId].splice(index, 1);
        return res.json({
          reply: `🛑 Order for **${canceled.product}** has been successfully canceled.`,
        });
      }
    }

    return res.json({
      reply: "❌ No matching order found to cancel. Try using the product name.",
    });
  }

  // Show categories
  if (lower.includes("show categories") || lower.includes("list categories")) {
    return res.json({
      reply: `🗂️ Available categories: ${Object.keys(datasets).join(", ")}`,
    });
  }

  // Search product
  if (lower.startsWith("search")) {
    const keyword = lower.split(" ").slice(1).join(" ");
    let results = [];
    for (const data of Object.values(datasets)) {
      results = results.concat(
        data.filter((item) =>
          item.product.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }

    if (results.length > 0) {
      return res.json({ products: results });
    }

    return res.json({
      reply: `🔍 No products found for **${keyword}**. Try a different keyword.`,
    });
  }

  // Suggest popular products
  if (
    lower.includes("popular products") ||
    lower.includes("suggest products")
  ) {
    const suggestions = [
      datasets.mobiles[0],
      datasets.tv[0],
      datasets.kitchen[0],
      datasets.men[0],
    ];
    return res.json({ products: suggestions });
  }

  // Category product list
  for (const key of Object.keys(datasets)) {
    if (lower.includes(key)) {
      return res.json({ products: datasets[key] });
    }
  }

  // Fallback to Cohere AI
  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/chat",
      { message, model: "command-r-plus" },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.json({ reply: response.data.text.trim() });
  } catch (err) {
    console.error("Cohere error:", err.message);
    return res.status(500).json({ error: "Failed to fetch reply" });
  }
});
