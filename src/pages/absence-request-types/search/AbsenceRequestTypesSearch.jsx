import React from 'react';
import Select from 'react-select';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field } from 'formik';
import { absenceRequestTypesSearchStore } from '../stores';
import { absenceTypeConst } from '../../../constants';

const AbsenceRequestTypesSearch = ({ fetchData }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { t } = useTranslation();

    const activityTypesOptions = ([
        { value: absenceTypeConst.ALL, label: t('ALL') },
        { value: absenceTypeConst.ACTIVE, label: t('ACTIVE') },
        { value: absenceTypeConst.INACTIVE, label: t('INACTIVE') },
    ])

    const handleSubmit = (values) => {
        absenceRequestTypesSearchStore.setQuery(values.searchQuery);
        absenceRequestTypesSearchStore.setIsActive(values.status.value === absenceTypeConst.ALL ? null : (values.status.value === absenceTypeConst.ACTIVE));
        const queryParams = absenceRequestTypesSearchStore.syncWithQueryParams();
        setSearchParams(queryParams);

        fetchData();
    };

    const handleClear = (setFieldValue) => {
        setSearchParams({});
        setFieldValue('searchQuery', "");
        setFieldValue('status', activityTypesOptions[0]);
        absenceRequestTypesSearchStore.clearFilters();
        fetchData();
    };

    return (
        <Formik
            initialValues={{
                searchQuery: absenceRequestTypesSearchStore.searchQuery,
                status: activityTypesOptions.find(
                    (option) => option.value === searchParams.get('status')
                ) || activityTypesOptions[0],
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
                        options={activityTypesOptions}
                        isSearchable={false}
                        isClearable
                        className="h-10 border-gray-300 input-select-border w-full md:min-w-[8rem] "
                        value={values.status}
                        onChange={(selectedOption) => {
                            setFieldValue('status', selectedOption || activityTypesOptions[0]);
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
