import { SalesRecord } from "../models/SalesRecord.js";

export const getSalesData = async (query) => {
  const filter = {};

  // 🔍 Search by Name or Phone
  if (query.search) {
    const s = query.search.trim();
    if (/^\d+$/.test(s)) {
      filter["Phone Number"] = { $regex: "^" + s };
    } else {
      filter["Customer Name"] = { $regex: s, $options: "i" };
    }
  }

  // 🔎 Multi-select filters
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

  // 🔖 Tags search
  if (query.tags) {
    filter["Tags"] = { $regex: query.tags, $options: "i" };
  }

  // 🔢 Age filter (convert string to number using $expr)
  if (query.ageMin || query.ageMax) {
    const conditions = [];
    if (query.ageMin) {
      conditions.push({ $gte: [{ $toDouble: "$Age" }, Number(query.ageMin)] });
    }
    if (query.ageMax) {
      conditions.push({ $lte: [{ $toDouble: "$Age" }, Number(query.ageMax)] });
    }
    if (conditions.length === 1) {
      filter.$expr = conditions[0];
    } else if (conditions.length === 2) {
      filter.$expr = { $and: conditions };
    }
  }

  // 📅 Date filter (stored as "YYYY-MM-DD" string)
  if (query.dateFrom || query.dateTo) {
    filter["Date"] = {};
    if (query.dateFrom) filter["Date"].$gte = query.dateFrom;
    if (query.dateTo) filter["Date"].$lte = query.dateTo;
  }

  // 🔽 Sorting
  const sort = {};
  const sortMap = {
    date: "Date",
    quantity: "Quantity",
    customerName: "Customer Name",
  };
  if (query.sortBy) {
    sort[sortMap[query.sortBy]] = query.order === "desc" ? -1 : 1;
  }

  // 📄 Pagination
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // 📊 DB Query
  const total = await SalesRecord.countDocuments(filter);

  const data = await SalesRecord.find(filter).sort(sort).skip(skip).limit(limit);

  return { total, page, limit, data };
};
