import React, { useState, useCallback, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { countriesService } from "../../../services";
import citiesSearchStore from '../stores/CitiesSearchStore';
import { observer } from "mobx-react";
import { Form, Formik, Field } from "formik";

export const CitiesSearch = observer(() => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCountryId, setSelectedCountryId] = useState(null);

    const [countries, setCountries] = useState([]);

    const handleSearch = () => {
        citiesSearchStore.setQuery(searchQuery);
        citiesSearchStore.setCountryId(selectedCountryId?.value || null);
    };

    const handleClear = (resetForm) => {
        setSearchQuery("");
        setSelectedCountryId(null);
        citiesSearchStore.clearFilters();
        resetForm()
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
        <Formik onSubmit={handleSearch} >
            {({ resetForm }) => (
            <Form>
            <div className="flex items-center space-x-4 mb-4">
            <Field
                type="text"
                placeholder="Search by City"
                className="input-search h-10 rounded-md border-gray-300 w-[25rem]"
                value={searchQuery}
                autoComplete="off"
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                }}
            />

            <Select
                value={selectedCountryId}
                onChange={(value) => {
                    if (value === null) {
                        setSelectedCountryId(null);
                        citiesSearchStore.setCountryId(null);
                    } else {
                        setSelectedCountryId(value);
                    }
                }}
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
                onClick={() => handleClear(resetForm)}
                className="btn-clear h-10 bg-gray-700 text-white hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-md border border-gray-300 font-bold text-sm"
            >
                Clear
            </button>
        </div>
        </Form>
            )}
        </Formik>
    );
}
);