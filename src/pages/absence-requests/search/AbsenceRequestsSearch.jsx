import React from 'react';
import { Formik, Form, Field } from 'formik';
import Select from 'react-select';
import { observer } from 'mobx-react';
//import absenceRequestsSearchStore from '../stores/AbsenceRequestsSearchStore';


const dropdownOptions = [
  { value: 'All', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];


const AbsenceRequestsSearch = observer (() => {
//   const initialValues = {
//     searchQuery: '',
//     status: { value: 'All', label: 'All' },
//     }
//     const handleSubmit = (values) => {
//     const query = values.searchQuery;
//     const status = values.status.value === 'active' ? true :
//                    values.status.value === 'inactive' ? false :
//                    null;
//                    absenceRequestsSearchStore.setSearchQuery(query); 
//                    absenceRequestsSearchStore.setIsActive(status);
//   };
  return (
    <Formik >
      {({ setFieldValue, values }) => (
        <Form>
          <div style={{ display: 'flex', gap: '1rem' }}>
          <Select
              name="status"
              placeholder="Select User"
              options={dropdownOptions}
              isSearchable={false}
              className="h-10 hover:bg-gray-100 border-gray-200 w-40 text-sm"
              value={values.status}
              
            />
            <Select
              name="status"
              placeholder="Select Type"
              options={dropdownOptions}
              isSearchable={false}
              className="h-10 hover:bg-gray-100 border-gray-200 w-40 text-sm"
              value={values.status}
              
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
export default AbsenceRequestsSearch;