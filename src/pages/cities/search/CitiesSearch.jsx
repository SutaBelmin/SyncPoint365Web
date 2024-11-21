import React, { useState, useCallback, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { countriesService } from "../../../services";
import citiesSearchStore from '../stores/CitiesSearchStore';
import { observer } from "mobx-react";

const CitiesSearch = observer(() => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCountryId, setSelectedCountryId] = useState(null);

    const [countries, setCountries] = useState([]);

    const handleSearch = () => {
        citiesSearchStore.setQuery(searchQuery);
        citiesSearchStore.setCountryId(selectedCountryId?.value || null);
    };

    const handleClear = () => {
        setSearchQuery("");
        setSelectedCountryId(null);
        citiesSearchStore.clearFilters();
    };

    const fetchCountries = useCallback(async () => {
        try {
            const response = await countriesService.getList();
            const countriesOption = response.data.map(country => ({
                value: country.id,
                label: country.name
            }));
            setCountries(countriesOption);
        } catch (error) {
            toast.error("There was an error. Please contact administrator.");
        }
    }, []);

    useEffect(() => { 
        fetchCountries();
    }, [fetchCountries]);


    return (
        <div className="flex items-center space-x-4 mb-4">
            <input
                type="text"
                placeholder="Search by City"
                className="input-search h-10 rounded-md border-gray-300 w-[25rem]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
}
);
export default CitiesSearch;
