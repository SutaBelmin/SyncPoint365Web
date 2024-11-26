import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import Select from 'react-select';
import { observer } from 'mobx-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import absenceRequestTypesSearchStore from '../stores/AbsenceRequestTypesSearchStore';
import { useTranslation } from 'react-i18next';

const AbsenceRequestTypesSearch = observer(() => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState({ value: 'All', label: 'All' });
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const dropdownOptions = [
        { value: 'All', label: t('ALL') },
        { value: 'active', label: t('ACTIVE') },
        { value: 'inactive', label: t('INACTIVE') },
    ];

    const initialValues = {
        searchQuery: '',
        status: { value: 'All', label: t('ALL') },
    }

    useEffect(() => {
        const query = searchParams.get('searchQuery') || '';
        const status = searchParams.get('status') || 'All';
        absenceRequestTypesSearchStore.setSearchQuery(query);
        absenceRequestTypesSearchStore.setIsActive(status === 'active' ? true : status === 'inactive' ? false : null);
    }, [searchParams]);




    const handleSubmit = (values) => {
        const queryParams = new URLSearchParams();
        if (values.searchQuery) queryParams.append('searchQuery', values.searchQuery);
        if (values.status.value !== 'All') queryParams.append('status', values.status.value);

        absenceRequestTypesSearchStore.setSearchQuery(values.searchQuery);
        absenceRequestTypesSearchStore.setIsActive(values.status.value === 'active' ? true : values.status.value === 'inactive' ? false : null);

        setSearchParams(queryParams);
        navigate({
            pathname: location.pathname,
            search: queryParams.toString(),
        });
    };

    return (
        <Formik initialValues={{ searchQuery, status: selectedStatus }}
            enableReinitialize
            onSubmit={handleSubmit}>
            {({ setFieldValue, values }) => (
                <Form className="flex flex-col gap-4 md:flex-row">
                    <Field
                        name="searchQuery"
                        type="text"
                        placeholder={t('SEARCH_ABSENCE_REQUEST_TYPE')}
                        className="input-search h-10 rounded-md border-gray-300 w-full"
                        autoComplete="off"
                        value={values.searchQuery}
                        onChange={(e) => {
                            setFieldValue('searchQuery', e.target.value);
                            setSearchQuery(e.target.value);
                        }}
                    />
                    <Select
                        name="status"
                        placeholder="Select"
                        options={dropdownOptions}
                        isSearchable={false}
                        className="h-10 border-gray-300 input-select-border w-full"
                        value={values.status}
                        onChange={(selectedOption) => {
                            setFieldValue('status', selectedOption);
                            handleSubmit({ ...values, status: selectedOption });
                        }}
                    />
                    <button type="submit" className="btn-common h-10">
                        {t('SEARCH')}
                    </button>
                </Form>
            )}
        </Formik>
    );
});

export default AbsenceRequestTypesSearch;
