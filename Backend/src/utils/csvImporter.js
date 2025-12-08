import fs from "fs";
import csv from "csv-parser";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import { SalesRecord } from "../models/SalesRecord.js";

dotenv.config();

const BATCH_SIZE = 5000;   // Batch size
const MAX_ROWS = 10000;    // Max rows to import

const importCSV = async () => {
  await connectDB();

  console.log("🧹 Clearing old data...");
  await SalesRecord.deleteMany({});

  const results = [];
  let totalInserted = 0;
  let streamEnded = false;

  console.log(`⏳ Importing dataset.csv (max ${MAX_ROWS} rows)...`);

  const stream = fs.createReadStream("dataset.csv").pipe(csv());

  const insertBatch = async () => {
    if (results.length === 0) return;
    await SalesRecord.insertMany(results);
    totalInserted += results.length;
    console.log(`📦 Inserted ${totalInserted} rows`);
    results.length = 0;
  };

  stream.on("data", async (row) => {
    if (totalInserted >= MAX_ROWS) {
      stream.destroy();  // Stop reading more rows
      return;
    }

    // Clean row
    Object.keys(row).forEach((k) => row[k] = row[k].trim());
    results.push(row);

    if (results.length === BATCH_SIZE) {
      stream.pause();
      await insertBatch();
      stream.resume();
    }
  });

  stream.on("end", async () => {
    if (!streamEnded) {
      streamEnded = true;
      await insertBatch();
      console.log(`✅ Import complete: ${totalInserted} rows inserted`);
      process.exit();
    }
  });

  stream.on("close", async () => {
    if (!streamEnded) {
      streamEnded = true;
      await insertBatch();
      console.log(`✅ Import complete: ${totalInserted} rows inserted`);
      process.exit();
    }
  });

  stream.on("error", (err) => {
    console.error("❌ CSV Import Error", err);
    process.exit(1);
  });
};

importCSV();
