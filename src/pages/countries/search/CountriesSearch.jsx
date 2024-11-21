import React, { useState } from "react";
import countriesSearchStore from "../stores/CountriesSearchStore";

export const CountriesSearch = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState(countriesSearchStore.searchQuery);

  const handleSearch = () => {
    countriesSearchStore.setSearchQuery(searchQuery);  
    onSearch(countriesSearchStore.filters);
  };

  const handleClearFilters = () => {
    countriesSearchStore.resetFilters();
    setSearchQuery(""); 
    onSearch(countriesSearchStore.filters);  
  };

  return (
    <div className="flex space-x-4">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search countries"
        className="input"
      />
      <button onClick={handleSearch} className="btn-new">Search</button>
      <button onClick={handleClearFilters} className="btn-new">Clear Filters</button>
    </div>
  );
};
