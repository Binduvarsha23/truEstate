import React, { useState } from "react";

export const FilterPanel = ({ filters, setFilters, onApply }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (field, value) => {
    setLocalFilters({ ...localFilters, [field]: value });
  };

  return (
    <div>
      <div>
        <label>Region:</label>
        <input
          type="text"
          value={localFilters.region || ""}
          onChange={(e) => handleChange("region", e.target.value)}
        />
      </div>
      <div>
        <label>Gender:</label>
        <input
          type="text"
          value={localFilters.gender || ""}
          onChange={(e) => handleChange("gender", e.target.value)}
        />
      </div>
      <button onClick={() => onApply(localFilters)}>Apply Filters</button>
    </div>
  );
};
