import Select from "react-select";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
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
    fetchCountries();
  }, [fetchCountries]);

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
        <Form className="flex flex-col gap-4 md:flex-row">
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
            className="h-10 border-gray-300 input-select-border w-full"
          />
          <button type="submit"
            className="btn-common h-10"
          >
            {t("SEARCH")}
          </button>
          <button
            type="button"
            onClick={() => handleClear(setFieldValue)}
            className="btn-common h-10"
          >
            {t("CLEAR")}
          </button>
        </Form>
      )}
    </Formik>
  );
};