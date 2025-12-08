import React, { useEffect, useState } from "react";
import axios from "axios";

const columns = [
  "Transaction ID",
  "Date",
  "Customer ID",
  "Customer Name",
  "Phone Number",
  "Gender",
  "Age",
  "Product Category",
  "Quantity",
  "Total Amount",
  "Customer Region",
  "Product ID",
  "Employee Name",
];

const SalesTable = () => {
  const [sales, setSales] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Filters & search
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState([]);
  const [genderFilter, setGenderFilter] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState([]);
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Sorting
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");

  const fetchSales = async () => {
    try {
      const params = {
        page,
        limit,
        search,
        sortBy,
        order,
        region: regionFilter.join(","),
        gender: genderFilter.join(","),
        category: categoryFilter.join(","),
        payment: paymentFilter.join(","),
        ageMin: ageMin || undefined,
        ageMax: ageMax || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      };

      const { data } = await axios.get(
        "https://truestate-cn56.onrender.com/api/sales",
        { params }
      );

      setSales(data.data);
      setTotal(data.total);
    } catch (err) {
      console.error("Sales fetch error", err);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [page, search, regionFilter, genderFilter, categoryFilter, paymentFilter, ageMin, ageMax, dateFrom, dateTo, sortBy, order]);

  const toggleFilter = (filter, setFilter, value) => {
    if (filter.includes(value)) {
      setFilter(filter.filter((f) => f !== value));
    } else {
      setFilter([...filter, value]);
    }
  };

  return (
    <div>
      <h2>Sales Records</h2>

      {/* Search */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search by Customer Name or Phone"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{ padding: "5px", width: "300px" }}
        />
      </div>

      {/* Filters */}
      <div style={{ marginBottom: "10px" }}>
        <div>
          <strong>Region:</strong>
          {["North", "South", "East", "West"].map((r) => (
            <label key={r} style={{ margin: "0 5px" }}>
              <input
                type="checkbox"
                checked={regionFilter.includes(r)}
                onChange={() => toggleFilter(regionFilter, setRegionFilter, r)}
              />
              {r}
            </label>
          ))}
        </div>

        <div>
          <strong>Gender:</strong>
          {["Male", "Female"].map((g) => (
            <label key={g} style={{ margin: "0 5px" }}>
              <input
                type="checkbox"
                checked={genderFilter.includes(g)}
                onChange={() => toggleFilter(genderFilter, setGenderFilter, g)}
              />
              {g}
            </label>
          ))}
        </div>

        <div>
          <strong>Product Category:</strong>
          {["Electronics", "Clothing", "Furniture"].map((c) => (
            <label key={c} style={{ margin: "0 5px" }}>
              <input
                type="checkbox"
                checked={categoryFilter.includes(c)}
                onChange={() => toggleFilter(categoryFilter, setCategoryFilter, c)}
              />
              {c}
            </label>
          ))}
        </div>

        <div>
          <strong>Payment:</strong>
          {["Cash", "Card", "UPI"].map((p) => (
            <label key={p} style={{ margin: "0 5px" }}>
              <input
                type="checkbox"
                checked={paymentFilter.includes(p)}
                onChange={() => toggleFilter(paymentFilter, setPaymentFilter, p)}
              />
              {p}
            </label>
          ))}
        </div>

        <div>
          <strong>Age:</strong>
          <input
            type="number"
            placeholder="Min"
            value={ageMin}
            onChange={(e) => setAgeMin(e.target.value)}
            style={{ width: "60px", margin: "0 5px" }}
          />
          -
          <input
            type="number"
            placeholder="Max"
            value={ageMax}
            onChange={(e) => setAgeMax(e.target.value)}
            style={{ width: "60px", margin: "0 5px" }}
          />
        </div>

        <div>
          <strong>Date:</strong>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />{" "}
          -
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
      </div>

      {/* Sorting */}
      <div style={{ marginBottom: "10px" }}>
        <strong>Sort By:</strong>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">None</option>
          <option value="date">Date</option>
          <option value="quantity">Quantity</option>
          <option value="customerName">Customer Name</option>
        </select>

        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Table */}
      <table border="1" cellPadding="5" style={{ width: "100%" }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sales.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                No records found
              </td>
            </tr>
          ) : (
            sales.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col}>{row[col] || "-"}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))}>
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>Page {page}</span>
        <button
          onClick={() =>
            setPage((p) => Math.min(p + 1, Math.ceil(total / limit)))
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SalesTable;
