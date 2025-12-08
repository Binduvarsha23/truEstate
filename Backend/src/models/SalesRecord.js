import mongoose from "mongoose";

const SalesRecordSchema = new mongoose.Schema({}, { strict: false });

export const SalesRecord = mongoose.model("SalesRecord", SalesRecordSchema);
