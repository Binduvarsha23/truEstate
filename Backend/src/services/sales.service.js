// services/sales.service.js
import { SalesRecord } from "../models/SalesRecord.js";

export const getSalesData = async (query) => {
  const filter = {};

  // 🔍 SEARCH (Name or Phone)
  if (query.search) {
    filter.$or = [
      { "Customer Name": { $regex: query.search, $options: "i" } },
      { "Phone Number": { $regex: query.search, $options: "i" } },
    ];
  }

  // 🔎 MULTI-SELECT FILTERS (Region / Gender / Category / Payment)
  const mappedFilters = [
    ["region", "Customer Region"],
    ["gender", "Gender"],
    ["category", "Product Category"],
    ["payment", "Payment Method"],
  ];

  for (let [queryKey, field] of mappedFilters) {
    if (query[queryKey]) {
      const values = query[queryKey].split(",");
      filter[field] = { $in: values };
    }
  }

  // 🔖 TAGS
  if (query.tags) {
    filter["Tags"] = { $regex: query.tags, $options: "i" };
  }

  // 🔢 AGE RANGE FIXED
  if (query.ageMin || query.ageMax) {
    filter["Age"] = {};

    if (query.ageMin) filter["Age"].$gte = Number(query.ageMin);
    if (query.ageMax) filter["Age"].$lte = Number(query.ageMax);
  }

  // 📅 DATE RANGE FIXED (Convert to real Date objects)
  if (query.dateFrom || query.dateTo) {
    filter["Date"] = {};

    if (query.dateFrom) {
      filter["Date"].$gte = new Date(query.dateFrom);
    }
    if (query.dateTo) {
      // Make end date inclusive by adding 23:59:59
      filter["Date"].$lte = new Date(query.dateTo + "T23:59:59");
    }
  }

  // 🔽 SORTING LOGIC
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

  // 📊 DATABASE QUERY
  const total = await SalesRecord.countDocuments(filter);

  const data = await SalesRecord.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  return { total, page, limit, data };
};
