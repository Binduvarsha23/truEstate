import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SalesTable.css";

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

// Reusable dropdown
const FilterDropdown = ({ label, value, setValue, options }) => {
  return (
    <div className="filter">
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="filter-select"
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

const SalesTable = () => {
  const [sales, setSales] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Dashboard summary
  const [dashboard, setDashboard] = useState({
    totalUnits: 0,
    totalAmount: 0,
    totalDiscount: 0,
  });

  // Filters
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [payment, setPayment] = useState("");

  // NEW: dropdown filters
  const [ageRange, setAgeRange] = useState("");
  const [dateRange, setDateRange] = useState("");

  // Sorting
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");

  // Decode age dropdown
  const decodeAge = (val) => {
    if (!val) return { min: "", max: "" };
    const [min, max] = val.split("-");
    return { min, max };
  };

  // Decode date dropdown
  const decodeDate = (val) => {
    if (!val) return { from: "", to: "" };
    const [from, to] = val.split("_");
    return { from, to };
  };

  const fetchDashboard = async () => {
    const { data } = await axios.get(
      "https://truestate-cn56.onrender.com/api/sales/dashboard"
    );
    setDashboard(data);
  };

  const fetchSales = async () => {
    try {
      const age = decodeAge(ageRange);
      const date = decodeDate(dateRange);

      const params = {
        page,
        limit,
        search,
        sortBy,
        order,
        region,
        gender,
        category,
        payment,
        ageMin: age.min || undefined,
        ageMax: age.max || undefined,
        dateFrom: date.from || undefined,
        dateTo: date.to || undefined,
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
    fetchDashboard();
  }, []);

  useEffect(() => {
    fetchSales();
  }, [
    page,
    search,
    region,
    gender,
    category,
    payment,
    ageRange,
    dateRange,
    sortBy,
    order,
  ]);

  // Page buttons logic
  const totalPages = Math.ceil(total / limit);
  const getPageButtons = () => {
    let arr = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + 4);

    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  };

  return (
    <div className="sales-container">

      {/* HEADER: Dashboard left, search right */}
      <div className="header-row">
        <h1>Sales Dashboard</h1>

        <div className="top-search">
          <input
            type="text"
            placeholder="Search name or phone..."
            className="search-input"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="filter-bar">

        <FilterDropdown
          label="Region"
          value={region}
          setValue={setRegion}
          options={["North", "South", "East", "West"]}
        />

        <FilterDropdown
          label="Gender"
          value={gender}
          setValue={setGender}
          options={["Male", "Female"]}
        />

        <FilterDropdown
          label="Category"
          value={category}
          setValue={setCategory}
          options={["Electronics", "Clothing", "Furniture"]}
        />

        <FilterDropdown
          label="Payment"
          value={payment}
          setValue={setPayment}
          options={["Cash", "Card", "UPI"]}
        />

        {/* AGE RANGE DROPDOWN */}
        <FilterDropdown
          label="Age Range"
          value={ageRange}
          setValue={setAgeRange}
          options={[
            "18-25",
            "25-35",
            "35-45",
            "45-60",
            "60-80",
          ]}
        />

        {/* DATE RANGE DROPDOWN */}
        <FilterDropdown
          label="Date Range"
          value={dateRange}
          setValue={setDateRange}
          options={[
            "2023-01-01_2023-06-30",
            "2023-07-01_2023-12-31",
            "2024-01-01_2024-06-30",
            "2024-07-01_2024-12-31",
          ]}
        />

        {/* SORT */}
        <FilterDropdown
          label="Sort"
          value={sortBy}
          setValue={setSortBy}
          options={["date", "quantity", "customerName"]}
        />
      </div>

      {/* STATS CARDS */}
      <div className="stats-row">
        <div className="stat-box">
          <h4>Total Units Sold</h4>
          <p>{dashboard.totalUnits}</p>
        </div>

        <div className="stat-box">
          <h4>Total Amount</h4>
          <p>₹{dashboard.totalAmount.toLocaleString()}</p>
        </div>

        <div className="stat-box">
          <h4>Total Discount</h4>
          <p>₹{dashboard.totalDiscount.toLocaleString()}</p>
        </div>
      </div>

      {/* TABLE */}
      <table className="sales-table">
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
              <td colSpan={columns.length} className="no-data">
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

      {/* PAGINATION */}
      <div className="pagination">
        {getPageButtons().map((num) => (
          <button
            key={num}
            className={num === page ? "active" : ""}
            onClick={() => setPage(num)}
          >
            {num}
          </button>
        ))}

        {totalPages > 5 && page < totalPages && <span>...</span>}

        {totalPages > 5 && (
          <button onClick={() => setPage(totalPages)}>Last</button>
        )}
      </div>
    </div>
  );
};

export default SalesTable;
