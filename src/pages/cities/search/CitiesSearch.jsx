import Select from "react-select";
import { useTranslation } from "react-i18next";
import { useSearchParams, useLocation } from "react-router-dom";
import React, { useState, useCallback, useEffect } from "react";

import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";

import { countriesService } from "../../../services";
import citiesSearchStore from "../stores/CitiesSearchStore";
import { useRequestAbort } from "../../../components/hooks/useRequestAbort";

export const CitiesSearch = ({ fetchData }) => {
  const { t } = useTranslation();
  const { signal } = useRequestAbort();
  const [countries, setCountries] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const fetchCountries = useCallback(async () => {
    try {
      const response = await countriesService.getList(signal);
      
      const countriesOption = response.data.map(country => ({
        value: country.id,
        label: country.name,
      }));
      setCountries(countriesOption);
    } 
    catch (error) {
      toast.error(t('ERROR_CONTACT_ADMIN'));
    }
  }, [signal, t]);

  useEffect(() => {
    citiesSearchStore.initializeQueryParams(location.search)
    fetchCountries();
  }, [fetchCountries, location.search]);

  useEffect(() => {
    setSearchParams(citiesSearchStore.queryParams);
}, [setSearchParams]);


  const handleSearch = (values) => {
    citiesSearchStore.setQuery(values.searchQuery);
    citiesSearchStore.setCountryId(values.countryId ? values.countryId : null);

    const queryParams = citiesSearchStore.syncWithQueryParams();
    setSearchParams(queryParams);

    fetchData();
  };

  const handleClear = (setFieldValue) => {
    setSearchParams({});
    setFieldValue("searchQuery", "");
    setFieldValue("countryId", null);
    citiesSearchStore.clearFilters();
    fetchData();
  };

  const initialValues = {
    searchQuery: citiesSearchStore.searchQuery,
    countryId: searchParams.get("countryId") ? parseInt(searchParams.get("countryId")) : citiesSearchStore.countryId || null,
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={handleSearch}
    >
      {({ setFieldValue, values }) => (
        <Form className="grid gap-4 w-full lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2 ss:grid-cols-1">
          <Field
            type="text"
            name="searchQuery"
            placeholder={t("SEARCH_BY_CITY")}
            value={values.searchQuery}
            onChange={(e) => setFieldValue('searchQuery', e.target.value)}
            autoComplete="off"
            className="input-search h-10 rounded-md border-gray-300 w-full"
          />
          <Select
            name="countryId"
            value={values.countryId ? { value: values.countryId, label: countries.find(c => c.value === values.countryId)?.label } : null}
            onChange={(option) => setFieldValue('countryId', option ? option.value : null)}
            options={countries}
            placeholder={t("SELECT_A_COUNTRY")}
            isClearable
            isSearchable
            className="h-10 border-gray-300 input-select-border w-full min-w-[11rem]"
          />
          <div className='flex gap-4 xs:w-full'>
						<button
							type="submit"
							className="btn-search"
						>
							{t('SEARCH')}
						</button>
						<button
							type="button"
							onClick={() => handleClear(setFieldValue)}
							className="btn-clear"
						>
							{t("CLEAR")}
						</button>
					</div>
        </Form>
      )}
    </Formik>
  );
};