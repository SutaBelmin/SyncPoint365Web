import React, { useEffect } from 'react';
import Select from 'react-select';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field } from 'formik';
import { absenceRequestTypesSearchStore } from '../stores';
import { absenceRequestTypeStatusConstant } from '../../../constants';


const AbsenceRequestTypesSearch = ({ fetchData }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { t } = useTranslation();

    useEffect(() => {
        setSearchParams(absenceRequestTypesSearchStore.queryParams);
    }, [setSearchParams]);

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
                <Form className="grid gap-4 w-full lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2 ss:grid-cols-1">
                    <Field
                        name="searchQuery"
                        type="text"
                        placeholder={t('SEARCH_ABSENCE_REQUEST_TYPE')}
                        className="input-search h-10 rounded-md border-gray-300 w-full"
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
                    <div className='flex gap-4 xs:w-full'>
                    <button 
                    type="submit" 
                    className="btn-new h-10 ss:w-full">
                        {t('SEARCH')}
                    </button>
                    <button
                        type="button"
                        onClick={() => handleClear(setFieldValue)}
                        className="btn-cancel ss:w-full"
                    >
                        {t("CLEAR")}
                    </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default AbsenceRequestTypesSearch;
