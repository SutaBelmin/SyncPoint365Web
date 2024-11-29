import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import countriesSearchStore from "../stores/CountriesSearchStore";
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from "react-router-dom";

export const CountriesSearch = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (values) => {
    countriesSearchStore.setSearchQuery(values.searchQuery);
    setSearchParams(countriesSearchStore.countryFilter);
  };

  const handleClearFilters = (setFieldValue) => {
    countriesSearchStore.resetFilters();
    setFieldValue("searchQuery", "");
  };
            
  useEffect(() => {
    countriesSearchStore.initializeQueryParams(searchParams);
  }, [searchParams]);

  return (
    <Formik
      initialValues={{searchQuery: countriesSearchStore.searchQuery}}
      onSubmit={handleSearch}
      enableReinitialize
    >
      {({ setFieldValue  }) => (
        <Form className="flex flex-col gap-4 xs:flex-row">
          <Field
            type="text"
            name="searchQuery"
            placeholder={t('SEARCH_COUNTRIES')}
            autoComplete="off"
            className="input-search h-10 rounded-md border-gray-300 min-w-[9rem] w-full"
            onChange={(e) => setFieldValue('searchQuery', e.target.value)}
          />
          <button type="submit" className="btn-common h-10">
            {t('SEARCH')}
          </button>
          <button
            type="button"
            onClick={() => handleClearFilters(setFieldValue)}
            className="btn-common h-10"
          >
            {t('CLEAR')}
          </button>
        </Form>
      )}
    </Formik>
  );

};
