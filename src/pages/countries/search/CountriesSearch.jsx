import React, {useState} from "react";

export const CountriesSearch = ({ onSearch, onClearFilters, initialSearchTerm }) => {

    const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");

    const HandleSearch=()=>{
        onSearch({searchQuery: searchTerm});
    };

    const handleClear=()=>{
        setSearchTerm("");
        onClearFilters();
    }

  return (
    <div className="mb-4 flex items-center space-x-2">
      <input
        type="text"
        className="p-2 border w-96"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}  
      />
      <button onClick={HandleSearch} className="btn-new">
        Filter
      </button>
      <button onClick={handleClear} className="btn-new">
        Clear 
      </button>
    </div>
  );
};
