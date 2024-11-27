import React, { useState, useCallback, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { countriesService } from "../../../services";
import { observer } from "mobx-react";
import { Formik, Form, Field } from "formik";
import { useTranslation } from 'react-i18next';
import { useRequestAbort } from "../../../components/hooks/useRequestAbort";
import { useSearchParams } from "react-router-dom";
import citiesSearchStore from '../stores/CitiesSearchStore';

export const CitiesSearch = observer(() => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCountryId, setSelectedCountryId] = useState(null);
    const [countries, setCountries] = useState([]);
    const { t } = useTranslation();
    const { signal } = useRequestAbort();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams(); 

    const initialValues = {
        searchQuery: searchParams.get("searchQuery") || '',
        selectedCountryId: searchParams.get("selectedCountryId") || null,
    };

    const handleSearch = () => {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append("searchQuery", searchQuery);
        if (selectedCountryId) queryParams.append("selectedCountryId", selectedCountryId.value);
        setSearchParams(queryParams);

        citiesSearchStore.setQuery(searchQuery);
        citiesSearchStore.setCountryId(selectedCountryId ? selectedCountryId.value : null);
    };

    const handleClear = () => {
        setSearchQuery("");
        setSelectedCountryId(null);
        setSearchParams({});
        citiesSearchStore.clearFilters();
    };

    const fetchCountries = useCallback(async () => {
        try {
            const response = await countriesService.getList(signal);
            const countriesOption = response.data.map(country => ({
                value: country.id,
                label: country.name
            }));
            setCountries(countriesOption);
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }
    }, [signal, t]);

    useEffect(() => {
        fetchCountries();
    }, [fetchCountries]);

    useEffect(() => {
        const query = searchParams.get("searchQuery") || '';
        const countryId = searchParams.get("selectedCountryId") || null;
        setSearchQuery(query);
        setSelectedCountryId(countryId ? {value: countryId, label: countryId} : null);
        citiesSearchStore.setQuery(query);
        citiesSearchStore.setCountryId(countryId ? countryId : null);
    }, [searchParams, countries]);

    return (
        <Formik
            initialValues={initialValues} onSubmit={handleSearch}>
            {
                <Form className="flex flex-col gap-4 md:flex-row">
                    <Field
                        type="text"
                        className="input-search h-10 rounded-md border-gray-300 w-full"
                        name="searchQuery"
                        placeholder={t('SEARCH_BY_CITY')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoComplete="off"
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
                        className="h-10 border-gray-300 input-select-border w-full"
                    />

                    <button
                        type="submit"
                        onClick={handleSearch}
                        className="btn-common h-10"
                    >
                        {t('SEARCH')}
                    </button>

                    <button
                        type="button"
                        onClick={handleClear}
                        className="btn-common h-10"
                    >
                        {t('CLEAR')}
                    </button>
                </Form>
            }
        </Formik>
    );
});
