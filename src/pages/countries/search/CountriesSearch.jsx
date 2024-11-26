import React, { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { useSearchParams } from "react-router-dom";
import countriesSearchStore from "../stores/CountriesSearchStore";
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from "react-router-dom";

export const CountriesSearch = () => {
  const { t } = useTranslation();
   const location = useLocation();
  const navigate = useNavigate();

export const CountriesSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("query") || "";

  const initialValues = { searchQuery };

  const handleSearch = (values) => {
    countriesSearchStore.setSearchQuery(values.searchQuery);
    setSearchParams({ query: values.searchQuery });
  };

  const handleClearFilters = (resetForm) => {
    countriesSearchStore.resetFilters();
    resetForm({ values: { searchQuery: '' } });
    setSearchParams({});
  };

  useEffect(() => {
    if (searchQuery) {
      countriesSearchStore.setSearchQuery(searchQuery);
    }
  }, [searchQuery]);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSearch}
    >
      {({ resetForm }) => (
        <Form className="flex flex-col gap-4 xs:flex-row">
          <Field
            type="text"
            name="searchQuery"
            placeholder={t('SEARCH_COUNTRIES')}
            autoComplete="off"
            className="input-search h-10 rounded-md border-gray-300 min-w-[9rem] w-full"
          />
          <button type="submit" className="btn-common h-10">
            {t('SEARCH')}
          </button>
          <button
            type="button"
            onClick={() => handleClearFilters(resetForm)}
            className="btn-common h-10"
          >
            {t('CLEAR')}
          </button>
        </Form>
      )}
    </Formik>
  );

};
