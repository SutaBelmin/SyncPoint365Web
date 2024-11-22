import React from 'react';
import { Formik, Form, Field } from 'formik';
import Select from 'react-select';
import { observer } from 'mobx-react';
import absenceRequestTypesListStore from '../stores/AbsenceRequestTypesListStore';

const dropdownOptions = [
  { value: 'All', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const AbsenceRequestTypesSearch = observer (() => {
  const initialValues = {
    searchQuery: absenceRequestTypesListStore.query || '',
    status: dropdownOptions.find(option => option.value === 
        (absenceRequestTypesListStore.isActive === null ? 'All' 
            : (absenceRequestTypesListStore.isActive ? 'active' : 'inactive'))) 
            || dropdownOptions[0],
        }
    const handleSubmit = (values) => {
    const query = values.searchQuery;
    const status = values.status.value === 'active' ? true :
                   values.status.value === 'inactive' ? false :
                   null;
    absenceRequestTypesListStore.setSearchQuery(query); 
    absenceRequestTypesListStore.setIsActive(status);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ setFieldValue, values }) => (
        <Form>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Field
              name="searchQuery"
              type="text"
              placeholder="Search..."
              className="border-gray-300 h-10 hover:text-gray-900 px-4 py-2 rounded-md text-sm"
              autoComplete="off"
            />

            <Select
              name="status"
              placeholder="Select"
              options={dropdownOptions}
              isSearchable={false}
              className="h-10 hover:bg-gray-100 border-gray-200 w-40 text-sm"
              value={values.status}
              onChange={(selectedOption) => {
                setFieldValue('status', selectedOption);
                handleSubmit({ ...values, status: selectedOption });
              }}
            />

            <button type="submit" className="btn-new h-10" >
              
              Search
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
});

export default AbsenceRequestTypesSearch;