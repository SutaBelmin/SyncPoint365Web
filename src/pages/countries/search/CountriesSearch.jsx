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
        <Form className="flex space-x-4">
          <Field
            type="text"
            name="searchQuery"
            placeholder={t('SEARCH_COUNTRIES')}
            autoComplete="off"
            className="input w-96"
          />
          <button type="submit" className="btn-new">
            {t('SEARCH')}
          </button>
          <button
            type="button"
            onClick={() => handleClearFilters(resetForm)}
            className="btn-new"
          >
            {t('CLEAR')}
          </button>
        </Form>
      )}
    </Formik>
);

};
