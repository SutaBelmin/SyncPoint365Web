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
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState({ value: 'All', label: 'All' });
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();


  const initialValues = {
    searchQuery: '',
    status: { value: 'All', label: t('ALL') },
  }

  useEffect(() => {
    absenceRequestTypesSearchStore.initializeQueryParams(searchParams);
    const query = searchParams.get('searchQuery') || '';
    const status = searchParams.get('status') || 'All';

    absenceRequestTypesSearchStore.setSearchQuery(query);
    absenceRequestTypesSearchStore.setIsActive(status === 'active' ? true : status === 'inactive' ? false : null);
  }, [searchParams]);

  const handleSubmit = (values) => {
    absenceRequestTypesSearchStore.setSearchQuery(values.searchQuery);
    absenceRequestTypesSearchStore.setIsActive(values.status.value === null ? null : (values.status.value === 'active'));
    setSearchParams(absenceRequestTypesSearchStore.syncWithQueryParams());
  };


  return (
    <Formik initialValues={{
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
        </Form>
      )}
    </Formik>
  );
});

export default AbsenceRequestTypesSearch;
