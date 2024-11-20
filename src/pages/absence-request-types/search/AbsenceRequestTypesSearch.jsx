import React from 'react';
import { Formik, Form, Field } from 'formik';
import Select from 'react-select';

const dropdownOptions = [
  { value: 'All', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const AbsenceRequestTypesSearch = ({ onSearch }) => {
  const initialValues = {
    searchQuery: '',
    status: { value: 'All', label: 'All' },
  };

  const handleSubmit = (values) => {
    const query = values.searchQuery.trim();
    const status = values.status.value === 'active' ? true :
                   values.status.value === 'inactive' ? false :
                   null;
    onSearch(query, status);
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

            <button type="submit" className="btn-new h-10">
              Search
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AbsenceRequestTypesSearch;
