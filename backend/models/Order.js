
// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: String,
  product: String,
  company: String,
  price: Number,
  status: String,
  expectedDelivery: String,
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);
