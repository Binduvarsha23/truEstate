import { SalesRecord } from "../models/SalesRecord.js";

export const getSalesData = async (query) => {
  const filter = {};

  // SEARCH
  if (query.search) {
    filter.$or = [
      { "Customer Name": { $regex: query.search, $options: "i" }},
      { "Phone Number": { $regex: query.search, $options: "i" }}
    ];
  }

  // MULTI FILTERS
  const multi = [
    ["region", "Customer Region"],
    ["gender", "Gender"],
    ["category", "Product Category"],
    ["payment", "Payment Method"],
  ];

  for (let [qKey, dbKey] of multi) {
    if (query[qKey]) filter[dbKey] = { $in: query[qKey].split(",") };
  }

  // TAGS
  if (query.tags) filter["Tags"] = { $regex: query.tags, $options: "i" };

  // AGE RANGE
  if (query.ageMin || query.ageMax) {
    filter["Age"] = {};
    if (query.ageMin) filter["Age"].$gte = Number(query.ageMin);
    if (query.ageMax) filter["Age"].$lte = Number(query.ageMax);
  }

  // DATE RANGE
  if (query.dateFrom || query.dateTo) {
    filter["Date"] = {};
    if (query.dateFrom) filter["Date"].$gte = query.dateFrom;
    if (query.dateTo) filter["Date"].$lte = query.dateTo;
  }

  // SORTING
  const sort = {};
  const map = {
    date: "Date",
    quantity: "Quantity",
    customerName: "Customer Name",
  };

  if (query.sortBy) {
    sort[map[query.sortBy]] = query.order === "asc" ? 1 : -1;
  }

  // PAGINATION
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await SalesRecord.countDocuments(filter);
  const data = await SalesRecord.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  return { total, page, limit, data };
};
