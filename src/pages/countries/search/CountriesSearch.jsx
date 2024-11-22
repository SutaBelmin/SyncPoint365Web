import React, { useState } from "react";
import countriesSearchStore from "../stores/CountriesSearchStore";

export const CountriesSearch = () => {
  const [searchQuery, setSearchQuery] = useState(countriesSearchStore.searchQuery);

  const handleSearch = () => {
    countriesSearchStore.setSearchQuery(searchQuery);
  };

  const handleClearFilters = () => {
    countriesSearchStore.resetFilters();
    setSearchQuery("");
  };

  return (
    <div className="flex space-x-4">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search countries"
        className="input w-96"
      />
      <button onClick={handleSearch} className="btn-new">
        Search
      </button>
      <button onClick={handleClearFilters} className="btn-new">
        Clear
      </button>
    </div>
  );
};
