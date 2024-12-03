import React, { useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import Select from 'react-select';
import { observer } from 'mobx-react';
import { useSearchParams } from 'react-router-dom';
import absenceRequestTypesSearchStore from '../stores/AbsenceRequestTypesSearchStore';
import { useTranslation } from 'react-i18next';

const dropdownOptions = [
    { value: 'All', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];
  
  const AbsenceRequestTypesSearch = observer(() => {
    const [searchParams, setSearchParams] = useSearchParams(); 
    const { t } = useTranslation();
  
    useEffect(() => {
      absenceRequestTypesSearchStore.initializeQueryParams(searchParams);
    }, [searchParams]);
  
    const handleSubmit = (values) => {
      absenceRequestTypesSearchStore.setQuery(values.searchQuery);   
      absenceRequestTypesSearchStore.setIsActive(values.status.value === 'All' ? null : (values.status.value === 'active'));
      setSearchParams(absenceRequestTypesSearchStore.syncWithQueryParams());
    };
  
    const handleClear = (setFieldValue) => {
      absenceRequestTypesSearchStore.reset();
      setFieldValue('searchQuery','');
      setFieldValue('status', dropdownOptions[0]);
      setSearchParams({});
    }
  
    return (
        <Formik
            initialValues={{
                searchQuery: searchParams.get('searchQuery') || '',
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
                        className="input-search h-10 rounded-md border-gray-300 w-full"
                        autoComplete="off"
                        value={values.searchQuery}
                        onChange={(e) => {
                            setFieldValue('searchQuery', e.target.value);
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
});

export default AbsenceRequestTypesSearch;
