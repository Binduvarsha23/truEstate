import React from "react";

export const SearchBar = ({ search, setSearch, onSearch }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search by customer name or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={onSearch}>Search</button>
    </div>
  );
};
