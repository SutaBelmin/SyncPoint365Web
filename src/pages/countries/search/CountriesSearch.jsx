import React, { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import countriesSearchStore from "../stores/CountriesSearchStore";
import { useTranslation } from 'react-i18next';
import { useSearchParams, useLocation } from "react-router-dom";

export const CountriesSearch = ({fetchData}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

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
    countriesSearchStore.initializeQueryParams(location.search)
    setSearchParams(countriesSearchStore.queryParams);
  }, [setSearchParams, location.search]);

  return (
    <Formik
      enableReinitialize
      initialValues={{searchQuery: countriesSearchStore.searchQuery}}
      onSubmit={handleSearch}
    >
      {({ setFieldValue  }) => (
        <Form className="grid gap-4 w-full xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 ss:grid-cols-1">
          <Field
            type="text"
            name="searchQuery"
            placeholder={t('SEARCH_COUNTRIES')}
            autoComplete="off"
            className="input-search h-10 rounded-md border-gray-300 w-full"
            onChange={(e) => setFieldValue('searchQuery', e.target.value)}
          />
          <div className='flex gap-4 '>
						<button
							type="submit"
							className="btn-search"
						>
							{t('SEARCH')}
						</button>
						<button
							type="button"
							onClick={() => handleClearFilters(setFieldValue)}
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
