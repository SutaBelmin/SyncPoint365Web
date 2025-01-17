import { useTranslation } from "react-i18next";
import { Formik, Form, Field } from "formik";
import companyDocumentsSearchStore from "../stores/CompanyDocumentsSearchStore";

export const CompanyDocumentsSearch = ({ fetchData }) => {
    const { t } = useTranslation();

    const handleSearch = (values) => {
        companyDocumentsSearchStore.setQuery(values.searchQuery);
        
        fetchData();
    };

    const handleClear = (setFieldValue) => {
        setFieldValue("searchQuery","");
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
            <Form className="flex items-centar gap-4">
                <Field
                    type="text"
                    name="searchQuery"
                    placeholder={t("SEARCH_BY_NAME")}
                    value={values.searchQuery}
                    onChange={(e) => setFieldValue('searchQuery', e.target.value)}
                    autoComplete="off"
                    className="input-search h-10 rounded-md border-gray-300"
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