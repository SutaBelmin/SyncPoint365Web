import React, { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { countriesService } from "../../../services";
import { observer } from "mobx-react";
import { Formik, Form, Field } from "formik";
import { useTranslation } from 'react-i18next';
import { useRequestAbort } from "../../../components/hooks/useRequestAbort";
import { useSearchParams } from "react-router-dom";
import citiesSearchStore from "../stores/CitiesSearchStore";

export const CitiesSearch = observer(() => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCountryId, setSelectedCountryId] = useState(null);
    const [countries, setCountries] = useState([]);
    const { t } = useTranslation();
    const { signal } = useRequestAbort();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

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
        const { searchQuery, countryId } = citiesSearchStore.cityFilter;
        const selectedCountryId = searchParams.get("selectedCountryId") || countryId;
        const searchQueryFromParams = searchParams.get("searchQuery") || searchQuery;
    });

    const initialValues = {
        searchQuery: citiesSearchStore.cityFilter.searchQuery,
        selectedCountryId: citiesSearchStore.cityFilter.countryId
            ? {
                value: citiesSearchStore.cityFilter.countryId,
                label: countries.find(
                    (c) => c.value === citiesSearchStore.cityFilter.countryId
                )?.label || citiesSearchStore.cityFilter.countryId,
            }
            : null,
    };

    const filteredCountries = countries.filter(
        (country) => !citiesSearchStore.cityFilter.countryId || country.value === citiesSearchStore.cityFilter.countryId
    );

    const handleSearch = (values) => {
        const queryParams = new URLSearchParams();
        if (values.searchQuery) queryParams.append("searchQuery", values.searchQuery);
        if (values.selectedCountryId)
            queryParams.append("selectedCountryId", values.selectedCountryId.value);
        setSearchParams(queryParams);
    }
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
                        value={values.searchQuery}
                        onChange={(e) => setFieldValue('searchQuery', e.target.value)}
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