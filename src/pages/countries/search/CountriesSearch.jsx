import React from "react";
import { Formik, Form, Field } from "formik";
import countriesSearchStore from "../stores/CountriesSearchStore";
import { useTranslation } from 'react-i18next';

export const CountriesSearch = () => {
  const initialValues = { searchQuery: countriesSearchStore.searchQuery };
  const { t } = useTranslation();

  const handleSearch = (values) => {
    countriesSearchStore.setSearchQuery(values.searchQuery);
  };

  const handleClearFilters = (resetForm) => {
    countriesSearchStore.resetFilters();
    resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSearch}
    >
      {({ resetForm }) => (
        <Form className="flex flex-col gap-4 sm:flex-row">
          <Field
            type="text"
            name="searchQuery"
            placeholder={t('SEARCH_COUNTRIES')}
            autoComplete="off"
            className="input-search h-10 rounded-md border-gray-300 w-full"
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
