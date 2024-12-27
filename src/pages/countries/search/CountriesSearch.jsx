import React, { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import countriesSearchStore from "../stores/CountriesSearchStore";
import { useTranslation } from 'react-i18next';
import { useSearchParams } from "react-router-dom";

export const CountriesSearch = ({fetchData}) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  countriesSearchStore.setSearchQuery(searchParams.get('searchQuery') || '');

  const handleSearch = (values) => {
    countriesSearchStore.setSearchQuery(values.searchQuery);

    const queryParams = countriesSearchStore.syncWithQueryParams();
    setSearchParams(queryParams);

    fetchData();
  };

  const handleClearFilters = (setFieldValue) => {
    setSearchParams({});
    setFieldValue("searchQuery", "");
    countriesSearchStore.resetFilters();
    fetchData();
  };
            
  useEffect(() => {
    setSearchParams(countriesSearchStore.queryParams);
  }, [setSearchParams]);

  return (
    <Formik
      enableReinitialize
      initialValues={{searchQuery: countriesSearchStore.searchQuery}}
      onSubmit={handleSearch}
    >
      {({ setFieldValue  }) => (
        <Form className="flex flex-col gap-4 xs:flex-row">
          <Field
            type="text"
            name="searchQuery"
            placeholder={t('SEARCH_COUNTRIES')}
            autoComplete="off"
            className="input-search h-10 rounded-md border-gray-300 min-w-[18rem] w-full"
            onChange={(e) => setFieldValue('searchQuery', e.target.value)}
          />
          <button type="submit" className="btn-new h-10">
            {t('SEARCH')}
          </button>
          <button
            type="button"
            onClick={() => handleClearFilters(setFieldValue)}
            className="btn-cancel h-10"
          >
            {t('CLEAR')}
          </button>
        </Form>
      )}
    </Formik>
  );

};
