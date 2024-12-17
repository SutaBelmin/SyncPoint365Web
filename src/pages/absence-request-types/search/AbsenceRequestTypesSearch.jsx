import React from 'react';
import Select from 'react-select';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field } from 'formik';
import { absenceRequestTypesSearchStore } from '../stores';
import { absenceRequestTypeStatusConstant } from '../../../constants';

const AbsenceRequestTypesSearch = ({ fetchData }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { t } = useTranslation();

    const absenceRequestTypeStatusOptions = ([
        { value: absenceRequestTypeStatusConstant.all, label: t('ALL') },
        { value: absenceRequestTypeStatusConstant.active, label: t('ACTIVE') },
        { value: absenceRequestTypeStatusConstant.inactive, label: t('INACTIVE') },
    ])

    const handleSubmit = (values) => {
        absenceRequestTypesSearchStore.setQuery(values.searchQuery);
        absenceRequestTypesSearchStore.setIsActive(values.status.value === absenceRequestTypeStatusConstant.all ? null : (values.status.value === absenceRequestTypeStatusConstant.active));
        const queryParams = absenceRequestTypesSearchStore.syncWithQueryParams();
        setSearchParams(queryParams);

        fetchData();
    };

    const handleClear = (setFieldValue) => {
        setSearchParams({});
        setFieldValue('searchQuery', "");
        setFieldValue('status', absenceRequestTypeStatusOptions.find(option => option.value === absenceRequestTypeStatusConstant.all));
        absenceRequestTypesSearchStore.clearFilters();
        fetchData();
    };

    return (
        <Formik
            initialValues={{
                searchQuery: absenceRequestTypesSearchStore.searchQuery || "",
                status: absenceRequestTypeStatusOptions.find(
                    (option) => option.value === searchParams.get('status')
                ) || absenceRequestTypeStatusOptions.find(option => option.value === absenceRequestTypeStatusConstant.all)
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
                        options={absenceRequestTypeStatusOptions}
                        isSearchable={false}
                        isClearable
                        className="h-10 border-gray-300 input-select-border w-full md:min-w-[8rem] "
                        value={values.status}
                        onChange={(selectedOption) => {
                            setFieldValue('status', selectedOption || absenceRequestTypeStatusOptions.find(option => option.value === absenceRequestTypeStatusConstant.all));
                        }}
                    />
                    <button type="submit" className="btn-common h-10">
                        {t('SEARCH')}
                    </button>
                    <button
                        type="button"
                        onClick={() => handleClear(setFieldValue)}
                        className="btn-cancel lg:w-[10rem] md:w-[10rem] sm:w-full sx:w-full"
                    >
                        {t("CLEAR")}
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default AbsenceRequestTypesSearch;
