import React, { useState } from "react";
import Select from "react-select";

const CitiesSearch = ({ onSearch, onClearFilters, countries, initialSearchTerm, initialSelectedCountry }) => {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");
    const [selectedCountryId, setSelectedCountryId] = useState(initialSelectedCountry || null);

    const handleSearch = () => {
        onSearch({ searchQuery: searchTerm, countryId: selectedCountryId?.value || null });
    };

    const handleClear = () => {
        setSearchTerm("");
        setSelectedCountryId(null);
        onClearFilters();
    };

    return (
        <div className="flex items-center space-x-4 mb-4">
            <input
                type="text"
                placeholder="Search by City"
                className="input-search h-10 rounded-md border-gray-300 w-[25rem]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Select
                value={selectedCountryId}
                onChange={setSelectedCountryId}
                options={countries}
                placeholder="Select Country"
                isClearable
                className="h-10 border-gray-300 input-select-border w-[25rem]"
            />

            <button
                type="button"
                onClick={handleSearch}
                className="btn-clear h-10 bg-gray-700 text-white hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-md border border-gray-300 font-bold text-sm"
            >
                Search
            </button>

            <button
                type="button"
                onClick={handleClear}
                className="btn-clear h-10 bg-gray-700 text-white hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-md border border-gray-300 font-bold text-sm"
            >
                Clear Filters
            </button>
        </div>
    );
};

export default CitiesSearch;
