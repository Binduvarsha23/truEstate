import { connectDB } from "./db.js";
import { SalesRecord } from "../models/SalesRecord.js";

const createIndexes = async () => {
  await connectDB();

  console.log("📌 Creating indexes...");

  await SalesRecord.collection.createIndexes([
    { key: { "Customer Name": 1 }},
    { key: { "Phone Number": 1 }},
    { key: { "Customer Region": 1 }},
    { key: { "Product Category": 1 }},
    { key: { "Payment Method": 1 }},
    { key: { "Date": -1 }},
    { key: { "Quantity": -1 }}
  ]);

  console.log("✅ Indexes created successfully");
  process.exit();
};

createIndexes();
