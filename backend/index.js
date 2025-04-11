import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

import { acData } from "./data/ac.js";
import { computerData } from "./data/computers.js";
import { fridgeData } from "./data/fridge.js";
import { tvData } from "./data/tv.js";
import { furnitureData } from "./data/furniture.js";
import { kitchenData } from "./data/kitchen.js";
import { menData } from "./data/men.js";
import { mobileData } from "./data/mobiles.js";
import { mobilesData } from "./data/proData.js";
import { speakerData } from "./data/speaker.js";
import { watchData } from "./data/watch.js";
import { womanData } from "./data/woman.js";

dotenv.config();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const datasets = {
  ac: acData,
  computer: computerData,
  fridge: fridgeData,
  furniture: furnitureData,
  kitchen: kitchenData,
  men: menData,
  mobiles: mobileData,
  prodata: mobilesData,
  speaker: speakerData,
  tv: tvData,
  watch: watchData,
  woman: womanData,
};

const orders = {
  user123: [
    {
      product: "iPhone 14",
      company: "Apple",
      price: 89999,
      image: "https://example.com/iphone.jpg",
      status: "Shipped",
      expectedDelivery: "April 12, 2025",
    },
    {
      product: "Sony TV 55 inch",
      company: "Sony",
      price: 58999,
      image: "https://example.com/tv.jpg",
      status: "Delivered",
      expectedDelivery: "April 5, 2025",
    },
  ],
  user456: [
    {
      product: "Samsung Galaxy S21",
      company: "Samsung",
      price: 69999,
      image: "https://example.com/samsung.jpg",
      status: "Delivered",
      expectedDelivery: "April 7, 2025",
    },
  ],
};

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  const lower = message.toLowerCase();

  if (["hello", "hi", "hey", "good morning", "good evening"].some(greet => lower.includes(greet))) {
    return res.json({ reply: "👋 Hello! How can I assist you today?" });
  }

  if (lower.includes("who are you") || lower.includes("what can you do") || lower.includes("about yourself")) {
    return res.json({
      reply: "🤖 I’m GG site’s chatbot! I can help you browse products, track or cancel orders, place new orders, and more!",
    });
  }

  if (lower === "help" || lower.includes("how to use")) {
    return res.json({
      reply: "🆘 You can ask me things like:\n- 'Show categories'\n- 'Order iPhone 14'\n- 'Cancel Samsung TV'\n- 'Search smartwatch'\n- 'Where is my order?'\n- 'Popular products'\n- 'Show mobiles'\n\nTry any of these!",
    });
  }

  if (lower.includes("thank you") || lower.includes("thanks") || lower.includes("thank u")) {
    return res.json({ reply: "🙏 You're welcome! Let me know if you need anything else." });
  }

  if (lower.startsWith("track")) {
    const keyword = lower.split(" ").slice(1).join(" ");
    const userId = "user123";
    const match = orders[userId]?.find(order =>
      order.product.toLowerCase().includes(keyword)
    );
    return res.json({
      reply: match
        ? `📦 Order for **${match.product}** is currently **${match.status}**. Estimated delivery: **${match.expectedDelivery}**.`
        : "❌ No matching order found to track. Try again with a different product name.",
    });
  }

  if (lower.includes("where is my order")) {
    return res.json({
      reply: "Can you please provide your user ID to check your order?",
    });
  }

  if (lower.startsWith("user")) {
    const userId = message.trim();
    const userOrders = orders[userId];
    if (userOrders?.length) {
      const reply = userOrders
        .map(order =>
          `🛒 **${order.product}** from **${order.company}** — ₹${order.price}, Status: ${order.status}, Delivery: ${order.expectedDelivery}`
        )
        .join("\n\n");
      return res.json({ reply });
    } else {
      return res.json({ reply: "Sorry, no order history found for this user ID." });
    }
  }

  if (lower.startsWith("order")) {
    const keyword = lower.split(" ").slice(1).join(" ").toLowerCase();
    for (const [key, data] of Object.entries(datasets)) {
      const matched = data.find(item =>
        item.product.toLowerCase().includes(keyword)
      );
      if (matched) {
        const userId = "user123";
        if (!orders[userId]) orders[userId] = [];
        orders[userId].push({
          product: matched.product,
          company: matched.company || matched.brand || matched.author,
          price: matched.price,
          image: matched.image,
          status: "Order Placed",
          expectedDelivery: "April 15, 2025",
        });
        return res.json({
          reply: `✅ Your order for **${matched.product}** has been placed successfully!`,
        });
      }
    }
    return res.json({ reply: "❌ Sorry, product not found to place order." });
  }

  if (lower.startsWith("cancel")) {
    const keyword = lower.split(" ").slice(1).join(" ");
    const userId = "user123";
    const index = orders[userId]?.findIndex(order =>
      order.product.toLowerCase().includes(keyword)
    );
    if (index !== -1) {
      const canceled = orders[userId][index].product;
      orders[userId].splice(index, 1);
      return res.json({
        reply: `🛑 Your order for **${canceled}** has been canceled.`,
      });
    }
    return res.json({ reply: "❌ No matching order found to cancel." });
  }

  if (lower.includes("show categories") || lower.includes("list categories")) {
    return res.json({
      reply: `🗂️ Available categories: ${Object.keys(datasets).join(", ")}`,
    });
  }

  if (lower.startsWith("search")) {
    const keyword = lower.split(" ").slice(1).join(" ");
    let results = [];
    for (const data of Object.values(datasets)) {
      results = results.concat(
        data.filter(item =>
          item.product.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }
    return res.json({
      ...(results.length > 0
        ? { products: results }
        : { reply: `🔍 No products found for **${keyword}**.` }),
    });
  }

  if (lower.includes("popular products") || lower.includes("suggest products")) {
    const suggestions = [
      datasets.mobiles[0],
      datasets.tv[0],
      datasets.kitchen[0],
      datasets.men[0],
    ];
    return res.json({ products: suggestions });
  }

  for (const key of Object.keys(datasets)) {
    if (lower.includes(key)) {
      return res.json({ products: datasets[key] });
    }
  }

  // 🔥 EXTRA RESPONSES

  if (lower.includes("how are you")) {
    return res.json({ reply: "😊 I'm doing great, thanks for asking! How can I help you today?" });
  }

  if (lower.includes("joke")) {
    return res.json({ reply: "😂 Why don’t scientists trust atoms? Because they make up everything!" });
  }

  const hour = new Date().getHours();
  if (lower.includes("greet me")) {
    const greeting =
      hour < 12
        ? "☀️ Good Morning!"
        : hour < 18
        ? "🌤️ Good Afternoon!"
        : "🌙 Good Evening!";
    return res.json({ reply: `${greeting} Hope you're having a great day!` });
  }

  if (lower.startsWith("recommend")) {
    const keyword = lower.split(" ").slice(1).join(" ");
    const category = Object.keys(datasets).find((key) =>
      keyword.includes(key)
    );
    if (category) {
      const recommended = datasets[category].slice(0, 3);
      return res.json({
        reply: `Here are some top ${category} products for you:`,
        products: recommended,
      });
    }
    return res.json({
      reply: "Please specify a category to get recommendations. For example: 'Recommend mobiles'",
    });
  }

  if (lower.includes("bored")) {
    return res.json({
      reply: "😎 Let's browse some gadgets or crack a joke to lift the mood! Type 'joke' or 'show mobiles'.",
    });
  }

  if (lower.includes("how to cancel") || lower.includes("how to order")) {
    return res.json({
      reply: "💡 To place an order, type `Order <product name>`.\nTo cancel, type `Cancel <product name>`.\nTry: `Order iPhone` or `Cancel TV`.",
    });
  }

  // Fallback to Cohere
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
    const reply = response.data.text.trim();
    res.json({ reply });
  } catch (err) {
    console.error("❌ Cohere API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

app.listen(PORT, () => {
  console.log(`🟢 Server running on http://localhost:${PORT}`);
});
