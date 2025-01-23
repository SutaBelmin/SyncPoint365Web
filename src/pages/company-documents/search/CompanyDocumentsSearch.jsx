import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import { useSearchParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { registerLocale } from "react-datepicker";
import { Formik, Form, Field } from "formik";
import { format } from 'date-fns';
import { localeConstant } from '../../../constants';
import { companyDocumentsSearchStore } from "../stores";

export const CompanyDocumentsSearch = ({ fetchData }) => {
    const { t, i18n } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    companyDocumentsSearchStore.setQuery(searchParams.get('searchQuery') || '');
    companyDocumentsSearchStore.setDateFrom(searchParams.get('dateFrom') || null);
    companyDocumentsSearchStore.setDateTo(searchParams.get('dateTo') || null);

    registerLocale(i18n.language, localeConstant[i18n.language]);

    useEffect(() => {
        companyDocumentsSearchStore.initializeQueryParams(location.search);
        setSearchParams(companyDocumentsSearchStore.queryParams);
    }, [setSearchParams, location.search]);

    const handleSearch = (values) => {
        companyDocumentsSearchStore.setQuery(values.searchQuery);
        companyDocumentsSearchStore.setDateFrom(values.dateFrom);
        companyDocumentsSearchStore.setDateTo(values.dateTo);

        const queryParams = companyDocumentsSearchStore.syncWithQueryParams();
        setSearchParams(queryParams);

        fetchData();
    };

    const handleClear = (setFieldValue) => {
        setSearchParams({});
        setFieldValue("searchQuery", "");
        setFieldValue("dateFrom", null);
        setFieldValue("dateTo", null);
        companyDocumentsSearchStore.clearFilters();
        fetchData();
    };

    const initialValues = {
        searchQuery: companyDocumentsSearchStore.searchQuery,
        dateFrom: companyDocumentsSearchStore.dateFrom,
        dateTo: companyDocumentsSearchStore.dateTo
    }

    return (
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={handleSearch}>
            {({setFieldValue, values}) => (
            <Form className="grid gap-4 w-full lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2 ss:grid-cols-1">
                <Field
                    type="text"
                    name="searchQuery"
                    placeholder={t("SEARCH_BY_NAME")}
                    value={values.searchQuery}
                    onChange={(e) => setFieldValue('searchQuery', e.target.value)}
                    autoComplete="off"
                    className="input-search h-10 rounded-md border-gray-300"
                />
                <DatePicker
                   id="dateFrom"
                   name="dateFrom"
                   selected={values.dateFrom ? new Date(values.dateFrom) : null}
                   onChange={(date) => {
                    const formattedDate = format(date, 'yyyy-MM-dd');
                    setFieldValue('dateFrom', formattedDate);
                   }}
                   dateFormat={t('DATE_FORMAT')}
                   placeholderText={t('DATE_FROM')}
                   autoComplete='off'
                   enableTabLoop={false}
                   locale={i18n.language}
                   className="h-10"
                />
                <DatePicker
                   id="dateTo"
                   name="dateTo"
                   selected={values.dateTo ? new Date(values.dateTo) : null}
                   onChange={(date) => {
                    const formattedDate = format(date, 'yyyy-MM-dd');
                    setFieldValue('dateTo',formattedDate);
                   }}
                   dateFormat={t('DATE_FORMAT')}
                   placeholderText={t('DATE_TO')}
                    autoComplete='off'
                    enableTabLoop={false}
                   locale={i18n.language}
                    className="h-10"
                />
                 
                <div className="flex gap-4 xs:w-full">
                    <button
                        type="submit"
                        className="btn-search"
                    >
                        {t('SEARCH')}
                    </button>
                    <button
                        type="button"
                        onClick={() => handleClear(setFieldValue)}
                        className="btn-clear">
                        {t('CLEAR')}
                    </button>
                </div>
            </Form>
            )}
        </Formik>
    );
};