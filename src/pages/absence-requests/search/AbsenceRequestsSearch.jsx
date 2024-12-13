import React, { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";
import { Formik, Form } from 'formik';
import { useRequestAbort } from "../../../components/hooks/useRequestAbort";
import { format } from 'date-fns';
import { useSearchParams } from "react-router-dom";
import { absenceRequestsSearchStore } from '../stores';
import { absenceRequestTypesService, userService, enumsService } from '../../../services';


export const AbsenceRequestsSearch = ({ fetchData }) => {
	const [absenceRequestTypes, setAbsenceRequestTypes] = useState([]);
	const [users, setUsers] = useState([]);
	const [statuses, setAbsenceRequestsStatuses] = useState([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const { t } = useTranslation();
	const { signal } = useRequestAbort();

	const nextYear = new Date().getFullYear() + 1;
	const maxDate = new Date(nextYear, 11, 31);


	const fetchUsers = useCallback(async () => {
		try {
			const response = await userService.getUsers(signal);
			const usersOptions = response.data.map(user => ({
				value: user.id,
				label: user.firstName + " " + user.lastName,
			}));
			setUsers(usersOptions);
		} catch (error) {
			toast.error(t('ERROR_CONTACT_ADMIN'));
		}
	}, [t, signal]);


	const fetchAbsenceRequestTypes = useCallback(async () => {
		try {
			const response = await absenceRequestTypesService.getList(signal);
			const activeAbsenceTypes = response.data.filter(type => type.isActive === true);
			const typesOptions = activeAbsenceTypes.map(type => ({
				value: type.id,
				label: type.name
			}));
			setAbsenceRequestTypes(typesOptions);
		} catch (error) {
			toast.error(t('ERROR_CONTACT_ADMIN')); 
		}
	}, [t, signal])

	const fetchAbsenceRequestStatus = useCallback(async () => {
		try {
			const response = await enumsService.getAbsenceRequestsStatus();
			const statusOptions = response.data.map(requestStatus => ({
				value: requestStatus.id,
				label: requestStatus.label === 'Approved' ? t('APPROVED') :
					   requestStatus.label === 'Pending' ? t('PENDING') :
					   requestStatus.label === 'Rejected' ? t('REJECTED') : requestStatus.label
			}));
			setAbsenceRequestsStatuses(statusOptions);
		} catch (error) {
			toast.error(t('ERROR_CONTACT_ADMIN'));
		}
	}, [t]);
	


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


	const handleSearch = (values) => {
		absenceRequestsSearchStore.setAbsenceTypeId(values.absenceRequestTypeId ? values.absenceRequestTypeId : null);
		absenceRequestsSearchStore.setUserId(values.userId ? values.userId : null);
		absenceRequestsSearchStore.setAbsenceRequestStatusId(values.absenceRequestStatusId);
		absenceRequestsSearchStore.setDateFrom(values.dateFrom ? values.dateFrom : null);
		absenceRequestsSearchStore.setDateTo(values.dateTo ? values.dateTo : null);

		const queryParams = absenceRequestsSearchStore.syncWithQueryParams();
		setSearchParams(queryParams);
		fetchData();
	};


	const handleClear = (setFieldValue) => {
		setSearchParams({});
		setFieldValue("absenceRequestTypeId", null);
		setFieldValue("userId", null);
		setFieldValue("absenceRequestStatusId", null);
		setFieldValue("dateFrom", null);
		setFieldValue("dateTo", null);
		absenceRequestsSearchStore.clearFilters();
		fetchData();
	};

	const initialValues = {
		absenceRequestTypeId: absenceRequestsSearchStore.absenceRequestTypeId,
		userId: absenceRequestsSearchStore.userId,
		absenceRequestStatusId: (() => {
            const statusIdFromParams = searchParams.get("absenceRequestStatusId");
            if (statusIdFromParams) {
                const parsedStatusId = parseInt(statusIdFromParams);
                absenceRequestsSearchStore.setAbsenceRequestStatusId(parsedStatusId);
                return parsedStatusId;
            }
            return absenceRequestsSearchStore.absenceRequestStatusId;
        })(),
		dateFrom: absenceRequestsSearchStore.dateFrom,
		dateTo: absenceRequestsSearchStore.dateTo,
	}

	return (
		<Formik
			enableReinitialize
			initialValues={initialValues}
			onSubmit={handleSearch}
		>
			{({ setFieldValue, values }) => (
				<Form className="grid gap-4 w-full lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 ss:grid-cols-1">
					<Select
						name="absenceRequestTypeId"
						id="absenceRequestTypeId"
						placeholder={t('SELECT_TYPE')}
						options={absenceRequestTypes}
						value={values.absenceRequestTypeId ? { value: values.absenceRequestTypeId, label: absenceRequestTypes.find(a => a.value === values.absenceRequestTypeId)?.label } : null}
						onChange={(option) => setFieldValue('absenceRequestTypeId', option ? option.value : null)}
						className="border-gray-300 input-select-border w-full min-w-[10rem] md:w-auto"
						isClearable
						isSearchable
					/>
					<Select
						name="userId"
						placeholder={t('SELECT_USER')}
						options={users}
						value={users.find((option) => option.value === values.userId) || null}
						onChange={(option) => setFieldValue("userId", option ? option.value : null)}
						className="border-gray-300 input-select-border w-full min-w-[12rem] md:w-auto"
						isClearable
						isSearchable

					/>

					<Select
						id="absenceRequestStatusId"
						name="absenceRequestStatusId"
						value={statuses.find(requestStatus => requestStatus.value === values.absenceRequestStatusId) || null}
						onChange={(option) => setFieldValue('absenceRequestStatusId', option && option.value)}
						options={statuses}
						placeholder={t('SELECT_STATUS')}
						className="border-gray-300 input-select-border w-full min-w-[11rem] md:w-auto"
						isClearable
						isSearchable
					/> 
					<DatePicker
						id='dateFrom'
						name="dateFrom"
						selected={values.dateFrom ? new Date(values.dateFrom) : null}
						onChange={(date) => {
							const formattedDate = format(date, 'yyyy-MM-dd');
							setFieldValue('dateFrom', formattedDate);
						}}
						dateFormat={t('DATE_FORMAT')}
						placeholderText={t('DATE_FROM')}
						maxDate={maxDate}
						autoComplete='off'
						scrollableYearDropdown
						enableTabLoop={false}
						className='input-search h-10 rounded-md border-gray-300 min-w-[7rem]'
					/>
					<DatePicker
						id='dateTo'
						name="dateTo"
						selected={values.dateTo ? new Date(values.dateTo) : null}
						onChange={(date) => {
							const formattedDate = format(date, 'yyyy-MM-dd');
							setFieldValue('dateTo', formattedDate);
						}}
						dateFormat={t('DATE_FORMAT')}
						placeholderText={t('DATE_TO')}
						maxDate={maxDate}
						autoComplete='off'
						enableTabLoop={false}
						scrollableYearDropdown
						className='input-search h-10 rounded-md border-gray-300 min-w-[7rem]'
					/>
					<div className='flex gap-4 '> 
						<button
							type="submit"
							className="btn-new h-10"
						>
							{t('SEARCH')}
						</button>
						<button
							type="button"
							onClick={() => handleClear(setFieldValue)}
							className="btn-cancel h-10"
						>
							{t("CLEAR")}
					</button>
					</div>
				</Form>
			)}
		</Formik >
	);
};