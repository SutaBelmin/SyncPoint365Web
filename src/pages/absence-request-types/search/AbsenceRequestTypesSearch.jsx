import React from 'react';
import { Formik, Form, Field } from 'formik';
import Select from 'react-select';
import { observer } from 'mobx-react';
import absenceRequestTypesSearchStore from '../stores/AbsenceRequestTypesSearchStore';
import { useTranslation } from 'react-i18next';

const AbsenceRequestTypesSearch = observer (() => {
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
    const handleSubmit = (values) => {
    const query = values.searchQuery;
    const status = values.status.value === 'active' ? true :
                   values.status.value === 'inactive' ? false :
                   null;
                   absenceRequestTypesSearchStore.setSearchQuery(query); 
                   absenceRequestTypesSearchStore.setIsActive(status);
  };
  
  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ setFieldValue, values }) => (
        <Form>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Field
              name="searchQuery"
              type="text"
              placeholder={t('SEARCH_ABSENCE_REQUEST_TYPE')}
              className="input-search h-10 rounded-md border-gray-300 w-[25rem]"
              autoComplete="off"
            />

            <Select
              name="status"
              placeholder="Select"
              options={dropdownOptions}
              isSearchable={false}
              className="h-10 border-gray-300 input-select-border w-[25rem]"
              value={values.status}
              onChange={(selectedOption) => {
                setFieldValue('status', selectedOption);
                handleSubmit({ ...values, status: selectedOption });
              }}
            />
            <button type="submit" className="btn-new h-10" >
              {t('SEARCH')}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
});

export default AbsenceRequestTypesSearch;