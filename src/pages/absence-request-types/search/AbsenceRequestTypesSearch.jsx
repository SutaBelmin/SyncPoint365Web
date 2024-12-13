import React from 'react';
import { Formik, Form, Field } from 'formik';
import Select from 'react-select';
import { useSearchParams } from 'react-router-dom';
import absenceRequestTypesSearchStore from '../stores/AbsenceRequestTypesSearchStore';
import { useTranslation } from 'react-i18next';

const AbsenceRequestTypesSearch = ({ fetchData }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { t } = useTranslation();

    const dropdownOptions = [
        { value: 'all' , label: t('ALL') },
        { value: 'active', label: t('ACTIVE') },
        { value: 'inactive', label: t('INACTIVE') }
    ];

    const handleSubmit = (values) => {
        absenceRequestTypesSearchStore.setQuery(values.searchQuery);
        absenceRequestTypesSearchStore.setIsActive(values.status.value === 'all' ? null : (values.status.value === 'active'));
        const queryParams = absenceRequestTypesSearchStore.syncWithQueryParams();
        setSearchParams(queryParams);

        fetchData();
    };

    const handleClear = (setFieldValue) => {
        setSearchParams({});
        setFieldValue('searchQuery', "");
        setFieldValue('status', dropdownOptions[0]);
        absenceRequestTypesSearchStore.clearFilters();
        fetchData();    
    };

    return (
        <Formik
            initialValues={{
                searchQuery: absenceRequestTypesSearchStore.searchQuery,
                status: dropdownOptions.find(
                    (option) => option.value === searchParams.get('status')
                ) || dropdownOptions[0],
            }}
            enableReinitialize
            onSubmit={handleSubmit}>
            {({ setFieldValue, values }) => (
                <Form className="flex flex-col gap-4 md:flex-row">
                    <Field
                        name="searchQuery"
                        type="text"
                        placeholder={t('SEARCH_ABSENCE_REQUEST_TYPE')}
                        className="input-search h-10 rounded-md border-gray-300 w-full md:w-[13rem]"
                        autoComplete="off"
                        value={values.searchQuery}
                        onChange={(e) => {
                            setFieldValue('searchQuery', e.target.value);
                        }}
                        
                    />
                    <Select
                        name="status"
                        placeholder={t("SELECT")}
                        options={dropdownOptions}
                        isSearchable={false}
                        isClearable
                        className="h-10 border-gray-300 input-select-border w-full md:min-w-[8rem] "
                        value={values.status}
                        onChange={(selectedOption) => {
                            setFieldValue('status', selectedOption || dropdownOptions[0]);
                        }}
                    />
                    <button type="submit" className="btn-common h-10">
                        {t('SEARCH')}
                    </button>
                    <button
                        type="button"
                        onClick={() => handleClear(setFieldValue)}
                        className="btn-cancel"
                    >
                        {t("CLEAR")}
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default AbsenceRequestTypesSearch;
