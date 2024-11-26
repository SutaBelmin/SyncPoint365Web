import React, { useState, useCallback, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { countriesService } from "../../../services";
import citiesSearchStore from '../stores/CitiesSearchStore';
import { observer } from "mobx-react";
import { Formik, Form, Field } from "formik";
import { useTranslation } from 'react-i18next';

export const CitiesSearch = observer(() => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCountryId, setSelectedCountryId] = useState(null);
    const [countries, setCountries] = useState([]);
    const { t } = useTranslation();

    const initialValues = {
        searchQuery: '',
        selectedCountryId: null,
        }

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
        <Formik 
        initialValues={initialValues} onSubmit={handleSearch}>
            {
            <Form>
        <div className="flex items-center space-x-4">
            <Field
                type="text"
                name= "searchQuery"
                placeholder={t('SEARCH_BY_CITY')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autocomplete="off"
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
                placeholder={t('SELECT_A_COUNTRY')}
                isClearable
                isSearchable
                className="h-10 border-gray-300 input-select-border w-[25rem]"
            />

            <button
                type="submit"
                onClick={handleSearch}
                className="btn-new"
            >
                {t('SEARCH')}
            </button>

            <button
                type="button"
                onClick={handleClear}
                className="btn-new"
            >
                {t('CLEAR')}
            </button>
        </div>
        </Form>
        }
        </Formik>
    );
}
);