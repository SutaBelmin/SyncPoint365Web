import React from 'react';
import { Formik, Form, Field } from 'formik';
import Select from 'react-select';
import { observer } from 'mobx-react';
import absenceRequestTypesSearchStore from '../stores/AbsenceRequestTypesSearchStore';
import { useTranslation } from 'react-i18next';

const AbsenceRequestTypesSearch = observer(() => {
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
				<Form className="flex flex-col gap-4 md:flex-row">
					<Field
						name="searchQuery"
						type="text"
						placeholder={t('SEARCH_ABSENCE_REQUEST_TYPE')}
						className="input-search h-10 rounded-md border-gray-300 w-full"
						autoComplete="off"
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