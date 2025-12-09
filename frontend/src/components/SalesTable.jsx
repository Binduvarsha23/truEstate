import React, { useEffect, useState, useRef } from "react";
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

// MultiSelectDropdown component
const MultiSelectDropdown = ({ label, options, selectedValues, setSelectedValues }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    if (selectedValues.includes(option)) {
      setSelectedValues(selectedValues.filter((v) => v !== option));
    } else {
      setSelectedValues([...selectedValues, option]);
    }
  };

  return (
    <div className="multi-select" ref={ref}>
      <div className="multi-select-header" onClick={() => setOpen(!open)}>
        {selectedValues.length > 0
          ? selectedValues.map((v) => <span key={v} className="pill">{v}</span>)
          : label}
        <span className="arrow">{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div className="multi-select-options">
          {options.map((opt) => (
            <label key={opt} className="multi-select-option">
              <input
                type="checkbox"
                checked={selectedValues.includes(opt)}
                onChange={() => toggleOption(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

// SortDropdown component
const SortDropdown = ({ sortField, setSortField, setSortOrder }) => {
  const options = [
    { label: "Date (Newest First)", value: "date", order: "desc" },
    { label: "Quantity (Low → High)", value: "quantity", order: "asc" },
    { label: "Customer Name (A → Z)", value: "customerName", order: "asc" },
  ];

  const handleChange = (e) => {
    const selected = options.find((o) => o.value === e.target.value);
    setSortField(selected.value);
    setSortOrder(selected.order);
  };

  return (
    <select value={sortField} onChange={handleChange} className="sort-dropdown">
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
};

const SalesTable = () => {
  const [sales, setSales] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [dashboard, setDashboard] = useState({
    totalUnits: 0,
    totalAmount: 0,
    totalDiscount: 0,
  });

  const [search, setSearch] = useState("");

  // Filters
  const [region, setRegion] = useState([]);
  const [gender, setGender] = useState([]);
  const [category, setCategory] = useState([]);
  const [payment, setPayment] = useState([]);
  const [ageRange, setAgeRange] = useState([]);
  const [dateRange, setDateRange] = useState([]);

  // Sorting
  const [sortBy, setSortBy] = useState("date");
  const [order, setOrder] = useState("desc");

  const fixedAgeRanges = ["18-25", "26-35", "36-45", "46-60"];
  const fixedDateRanges = [
    "2021-01-01_2021-12-31",
    "2022-01-01_2022-12-31",
    "2023-01-01_2023-12-31",
  ];

  const decodeMulti = (arr) => (arr.length ? arr.join(",") : undefined);

  // Fetch dashboard stats
  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get(
        "https://truestate-cn56.onrender.com/api/sales/dashboard"
      );
      setDashboard(data);
    } catch (err) {
      console.error("Dashboard fetch error", err);
    }
  };

  // Fetch sales data
  const fetchSales = async () => {
    try {
      let ageMin, ageMax;
      if (ageRange.length > 0) {
        const mins = ageRange.map((r) => Number(r.split("-")[0]));
        const maxs = ageRange.map((r) => Number(r.split("-")[1]));
        ageMin = Math.min(...mins);
        ageMax = Math.max(...maxs);
      }

      let dateFrom, dateTo;
      if (dateRange.length > 0) {
        const froms = dateRange.map((d) => new Date(d.split("_")[0]));
        const tos = dateRange.map((d) => new Date(d.split("_")[1] + "T23:59:59"));
        dateFrom = new Date(Math.min(...froms));
        dateTo = new Date(Math.max(...tos));
      }

      const params = {
        page,
        limit,
        search: search || undefined,
        sortBy,
        order,
        region: decodeMulti(region),
        gender: decodeMulti(gender),
        category: decodeMulti(category),
        payment: decodeMulti(payment),
        ageMin,
        ageMax,
        dateFrom: dateFrom ? dateFrom.toISOString().split("T")[0] : undefined,
        dateTo: dateTo ? dateTo.toISOString().split("T")[0] : undefined,
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

  const totalPages = Math.ceil(total / limit);
  const getPageButtons = () => {
    const arr = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  };

  return (
    <div className="sales-container">
      {/* Header */}
      <div className="header-row">
        <h1>Sales Dashboard</h1>
        <input
          type="text"
          placeholder="Search name or phone..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Filters + Sort */}
      <div className="filter-bar">
        <MultiSelectDropdown label="Region" options={["North","South","East","West"]} selectedValues={region} setSelectedValues={setRegion} />
        <MultiSelectDropdown label="Gender" options={["Male","Female"]} selectedValues={gender} setSelectedValues={setGender} />
        <MultiSelectDropdown label="Category" options={["Electronics","Clothing","Furniture","Beauty"]} selectedValues={category} setSelectedValues={setCategory} />
        <MultiSelectDropdown label="Payment" options={["Cash","Card","UPI"]} selectedValues={payment} setSelectedValues={setPayment} />
        <MultiSelectDropdown label="Age Range" options={fixedAgeRanges} selectedValues={ageRange} setSelectedValues={setAgeRange} />
        <MultiSelectDropdown label="Date Range" options={fixedDateRanges} selectedValues={dateRange} setSelectedValues={setDateRange} />
        <div className="sort-container">
          <SortDropdown sortField={sortBy} setSortField={setSortBy} setSortOrder={setOrder} />
        </div>
      </div>

      {/* Stats */}
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

      {/* Table */}
      <table className="sales-table">
        <thead>
          <tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr>
        </thead>
        <tbody>
          {sales.length === 0 ? (
            <tr><td colSpan={columns.length} className="no-data">No records found</td></tr>
          ) : (
            sales.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => <td key={col}>{row[col] || "-"}</td>)}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination center">
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
        {totalPages > 5 && <button onClick={() => setPage(totalPages)}>Last</button>}
      </div>
    </div>
  );
};

export default SalesTable;
