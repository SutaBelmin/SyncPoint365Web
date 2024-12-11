import React, { useCallback, useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import Select from 'react-select';
import { observer } from 'mobx-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { absenceRequestTypesService, userService } from '../../../services';
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useSearchParams } from "react-router-dom";
import { absenceRequestsSearchStore } from '../stores';
import { action } from 'mobx';
import enumsService from '../../../services/enumsService';


export const AbsenceRequestsSearch = observer(() => {
	const [absenceRequestTypes, setAbsenceRequestTypes] = useState([]);
	const [users, setUsers] = useState([]);
	const [statusOptions, setAbsenceRequestsStatus] = useState([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const { t } = useTranslation();
	const nextYear = new Date().getFullYear() + 1;
	const maxDate = new Date(nextYear, 11, 31);


	const fetchUsers = useCallback(async () => {
		try {
			const responseUsers = await userService.getUsers();
			setUsers(responseUsers.data.map(user => ({
				value: user.id,
				label: user.firstName + " " + user.lastName,
			})));
		} catch (error) {
			toast.error(t('ERROR_CONTACT_ADMIN'));
		}
	}, [t]);


	const fetchAbsenceRequestTypes = useCallback(async () => {
		try {
			const responseAbsenceType = await absenceRequestTypesService.getList();
			const activeAbsenceTypes = responseAbsenceType.data.filter(type => type.isActive === true);
			setAbsenceRequestTypes(activeAbsenceTypes.map(type => ({
				value: type.id,
				label: type.name
			})));
		} catch (error) {
			toast.error(t('ERROR_CONTACT_ADMIN'));
		}
	}, [t])

	const fetchAbsenceRequestStatus = useCallback(async () => {
		try {
			const responseStatus = await enumsService.getAbsenceRequestsStatus();
			setAbsenceRequestsStatus(responseStatus.data.map(status => ({
				value: status.id,
				label: status.label === 'Approved' ? t('APPROVED') :
					   status.label === 'Rejected' ? t('REJECTED') :
					   status.label === 'Pending' ? t('PENDING') : status.label
			})));
		} catch (error) {
			toast.error(t('ERROR_CONTACT_ADMIN'));
		}
	}, [t])


	useEffect(() => {
		fetchUsers();
		fetchAbsenceRequestTypes();
		fetchAbsenceRequestStatus();
		absenceRequestsSearchStore.initializeQueryParams(searchParams);

		const typeFromParams = searchParams.get("absenceRequestTypeId");
		if (typeFromParams)
			absenceRequestsSearchStore.setAbsenceTypeId(parseInt(typeFromParams));

		const userFromParams = searchParams.get("userId");
		if (userFromParams)
			absenceRequestsSearchStore.setUserId(parseInt(userFromParams));
	}, [searchParams, fetchAbsenceRequestTypes, fetchUsers, fetchAbsenceRequestStatus]);


	const handleSubmit = action((values) => {

		const { absenceRequestTypeId, userId, dateFrom, dateTo } = values;

		absenceRequestsSearchStore.setAbsenceTypeId(absenceRequestTypeId || null);
		absenceRequestsSearchStore.setUserId(userId || null);
		absenceRequestsSearchStore.setDateFrom(dateFrom || null);
		absenceRequestsSearchStore.setDateTo(dateTo || null);

		const queryParams = absenceRequestsSearchStore.syncWithQueryParams();
		setSearchParams(queryParams);
	});


	const handleClear = (setFieldValue) => {
		setSearchParams({});
		absenceRequestsSearchStore.reset();
		setFieldValue("absenceRequestTypeId", null);
		setFieldValue("userId", null);
		setFieldValue("dateFrom", null);
		setFieldValue("dateTo", null);
	};

	return (
		<Formik
			initialValues={{
				absenceRequestTypeId: null,
				dateFrom: "",
				dateTo: "",
				userId: null,
			}}
			onSubmit={handleSubmit}
		>
			{({ setFieldValue, values }) => (
				<Form className="flex flex-col gap-4 max-w-full md:flex-row">
					<Select
						name="absenceRequestTypeId"
						id="absenceRequestTypeId"
						placeholder={t('SELECT_TYPE')}
						options={absenceRequestTypes}
						value={absenceRequestTypes.find((option) => option.value === values.absenceRequestTypeId) || null}
						onChange={(option) => setFieldValue('absenceRequestTypeId', option ? option.value : null)}
						className="border-gray-300 input-select-border w-full min-w-[10rem]"
						isClearable
					/>
					<Select
						name="userId"
						id="userId"
						placeholder={t('SELECT_USER')}
						options={users}
						value={users.find((option) => option.value === values.userId) || null}
						onChange={(option) => setFieldValue("userId", option ? option.value : null)}
						className="border-gray-300 input-select-border w-full min-w-[12rem]"
						isClearable

					/>

					<Select
						name="absenceRequestStatus"
						id="absenceRequestStatus"
						placeholder={t('SELECT_USER')}
						options={statusOptions}
						value={statusOptions.find((option) => option.value === values.absenceRequestStatus) || null}
						onChange={(option) => setFieldValue("userId", option ? option.value : null)}
						className="border-gray-300 input-select-border w-full min-w-[12rem]"
						isClearable

					/>
					<DatePicker
						id='dateFrom'
						name="dateFrom"
						selected={values.dateFrom ? new Date(values.dateFrom) : null}
						onChange={(date) => {
							const formattedDate = format(date, 'yyyy/MM/dd');
							setFieldValue('dateFrom', formattedDate);
						}}
						dateFormat={t('DATE_FORMAT')}
						placeholderText={t('DATE_FROM')}
						maxDate={maxDate}
						autoComplete='off'
						yearDropdownItemNumber={100}
						scrollableYearDropdown
						className='input-search h-10 rounded-md border-gray-300 min-w-[3rem]'
					/>
					<DatePicker
						id='dateTo'
						name="dateTo"
						selected={values.dateTo ? new Date(values.dateTo) : null}
						onChange={(date) => {
							const formattedDate = format(date, 'yyyy/MM/dd');
							setFieldValue('dateTo', formattedDate);
						}}
						dateFormat={t('DATE_FORMAT')}
						placeholderText={t('DATE_TO')}
						maxDate={maxDate}
						autoComplete='off'
						yearDropdownItemNumber={100}
						scrollableYearDropdown
						className='input-search h-10 rounded-md border-gray-300 min-w-[3rem]'
					/>
					<button
						type="submit"
						className="btn-new h-10"
						onClick={handleSubmit}
					>
						{t('SEARCH')}
					</button>
					<button
						type="button"
						onClick={() => handleClear(setFieldValue)}
						className="btn-common h-10"
					>
						{t("CLEAR")}
					</button>


				</Form>

			)}

		</Formik >
	);
});