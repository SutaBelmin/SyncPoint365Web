import React, {useEffect} from "react";
import { Formik, Form, Field } from "formik";
import countriesSearchStore from "../stores/CountriesSearchStore";
import { useTranslation } from 'react-i18next';
import { useSearchParams } from "react-router-dom";

export const CountriesSearch = ({fetchData}) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

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
    countriesSearchStore.initializeQueryParams(searchParams);
  }, [searchParams]);

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
