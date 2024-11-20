import React from "react";

export const CountriesSearch = ({ searchTerm, setSearchTerm, onFilterClick, onClearFilterClick }) => {
  return (
    <div className="mb-4 flex items-center space-x-2">
      <input
        type="text"
        className="p-2 border w-96"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={onFilterClick} className="btn-new">
        Apply Filter
      </button>
      <button onClick={onClearFilterClick} className="btn-new">
        Clear Filter
      </button>
    </div>
  );
};
