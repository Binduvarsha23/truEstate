// services/sales.service.js
import { SalesRecord } from "../models/SalesRecord.js";

export const getSalesData = async (query) => {
  const filter = {};

  // 🔍 FIXED SEARCH (Name or Phone)
  if (query.search) {
    const s = query.search.trim();

    if (/^\d+$/.test(s)) {
      // Phone search must start with digits entered
      filter["Phone Number"] = { $regex: "^" + s };
    } else {
      filter["Customer Name"] = { $regex: s, $options: "i" };
    }
  }

  // 🔎 MULTI-SELECT FILTERS
  const mappedFilters = [
    ["region", "Customer Region"],
    ["gender", "Gender"],
    ["category", "Product Category"],
    ["payment", "Payment Method"],
  ];

  for (let [queryKey, field] of mappedFilters) {
    if (query[queryKey]) {
      filter[field] = { $in: query[queryKey].split(",") };
    }
  }

  // 🔖 TAGS
  if (query.tags) {
    filter["Tags"] = { $regex: query.tags, $options: "i" };
  }

  // 🔢 FIXED AGE RANGE
  if (query.ageMin || query.ageMax) {
    filter["Age"] = {};
    if (query.ageMin) filter["Age"].$gte = Number(query.ageMin);
    if (query.ageMax) filter["Age"].$lte = Number(query.ageMax);
  }

  // 📅 FIXED DATE RANGE
  if (query.dateFrom || query.dateTo) {
    filter["Date"] = {};
    if (query.dateFrom) filter["Date"].$gte = new Date(query.dateFrom);
    if (query.dateTo) filter["Date"].$lte = new Date(query.dateTo + "T23:59:59");
  }

  // 🔽 SORTING
  const sort = {};
  const sortMap = {
    date: "Date",
    quantity: "Quantity",
    customerName: "Customer Name",
  };

  if (query.sortBy) {
    sort[sortMap[query.sortBy]] = query.order === "desc" ? -1 : 1;
  }

  // 📄 PAGINATION
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // 📊 DB QUERY
  const total = await SalesRecord.countDocuments(filter);

  const data = await SalesRecord.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  return { total, page, limit, data };
};
