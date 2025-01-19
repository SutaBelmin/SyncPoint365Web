import { useTranslation } from "react-i18next";
import { Formik, Form, Field } from "formik";
import companyDocumentsSearchStore from "../stores/CompanyDocumentsSearchStore";
import DatePicker from "react-datepicker";
import { format } from 'date-fns';

export const CompanyDocumentsSearch = ({ fetchData }) => {
    const { t, i18n } = useTranslation();

    const handleSearch = (values) => {
        companyDocumentsSearchStore.setQuery(values.searchQuery);
        companyDocumentsSearchStore.setDateFrom(values.dateFrom);
        companyDocumentsSearchStore.setDateTo(values.dateTo);

        fetchData();
    };

    const handleClear = (setFieldValue) => {
        setFieldValue("searchQuery", "");
        setFieldValue("dateFrom", null);
        setFieldValue("dateTo", null);

        companyDocumentsSearchStore.clearFilters();

        fetchData();
    };

    const initialValues = {
        searchQuery: companyDocumentsSearchStore.searchQuery
    }

    return (
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={handleSearch}>
            {({setFieldValue, values}) => (
            <Form className="flex items-centar gap-4 w-full">
                <Field
                    type="text"
                    name="searchQuery"
                    placeholder={t("SEARCH_BY_NAME")}
                    value={values.searchQuery}
                    onChange={(e) => setFieldValue('searchQuery', e.target.value)}
                    autoComplete="off"
                    className="input-search h-10 rounded-md border-gray-300 min-w-[25rem]"
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
                   locale={i18n.language}
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
                   locale={i18n.language}
                />
                 

                <div className="flex gap-4">
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