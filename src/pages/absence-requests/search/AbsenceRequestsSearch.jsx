import React, { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from 'react-i18next';
import { registerLocale } from "react-datepicker";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { Formik, Form } from 'formik';
import { useRequestAbort } from "../../../components/hooks/useRequestAbort";
import { format } from 'date-fns';
import { absenceRequestsSearchStore } from '../stores';
import { absenceRequestTypesService, usersService, enumsService } from '../../../services';
import { localeConstant, absenceRequestStatusConstant } from '../../../constants';
import { yearOptions } from '../../../utils/';
import '../AbsenceRequestsList.css'


export const AbsenceRequestsSearch = ({ fetchData }) => {
	const [isFirstLoad, setIsFirstLoad] = useState(true);
	const [absenceRequestTypes, setAbsenceRequestTypes] = useState([]);
	const [users, setUsers] = useState([]);
	const [statuses, setAbsenceRequestsStatuses] = useState([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const { t, i18n } = useTranslation();
	const { signal } = useRequestAbort();
	

	const nextYear = new Date().getFullYear() + 1;
	const maxDate = new Date(nextYear, 11, 31);

	registerLocale(i18n.language, localeConstant[i18n.language]);


	const fetchUsers = useCallback(async () => {
		try {
			const response = await usersService.getUsers(signal);
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
			const response = await absenceRequestTypesService.getList(true, signal);
			const typesOptions = response.data.map(type => ({
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
			const response = await enumsService.getAbsenceRequestsStatus(signal);
			const statusOptions = response.data.map(requestStatus => ({
				value: requestStatus.id,
				label: requestStatus.label === absenceRequestStatusConstant.approved ? t('APPROVED') :
					requestStatus.label === absenceRequestStatusConstant.pending ? t('PENDING') :
						requestStatus.label === absenceRequestStatusConstant.rejected ? t('REJECTED') :
							requestStatus.label
			}));
			setAbsenceRequestsStatuses(statusOptions);
		} catch (error) {
			toast.error(t('ERROR_CONTACT_ADMIN'));
		}
	}, [signal, t]);

	useEffect(() => {
		setSearchParams(absenceRequestsSearchStore.queryParams);
	}, [setSearchParams]);

	useEffect(() => {
		fetchUsers();
		fetchAbsenceRequestTypes();
		fetchAbsenceRequestStatus();
	}, [fetchAbsenceRequestTypes, fetchUsers, fetchAbsenceRequestStatus]);


	const handleSearch = (values) => {
		absenceRequestsSearchStore.setAbsenceTypeId(values.absenceRequestTypeId);
		absenceRequestsSearchStore.setUserId(values.userId);
		absenceRequestsSearchStore.setAbsenceRequestStatusId(values.absenceRequestStatusId);
		absenceRequestsSearchStore.setDateFrom(values.dateFrom);
		absenceRequestsSearchStore.setDateTo(values.dateTo);
		absenceRequestsSearchStore.setYear(values.year);

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
		setFieldValue("year", null);
		absenceRequestsSearchStore.clearFilters();

		fetchData();
	};


	const initialValues = {
		absenceRequestTypeId: (() => {
			const typeFromParams = searchParams.get("absenceRequestTypeId");
			if (typeFromParams) {
				const parsedTypeId = parseInt(typeFromParams);
				absenceRequestsSearchStore.setAbsenceTypeId(parsedTypeId);
				return parsedTypeId;
			}
			return absenceRequestsSearchStore.absenceRequestTypeId;
		})(),
		userId: (() => {
			const userFromParams = searchParams.get("userId");
			if (userFromParams) {
				const parsedUserId = parseInt(userFromParams);
				absenceRequestsSearchStore.setUserId(parsedUserId);
				return parsedUserId;
			}
			return absenceRequestsSearchStore.userId;
		})(),
		absenceRequestStatusId: (() => {
			const statusIdFromParams = searchParams.get("absenceRequestStatusId");
			if (statusIdFromParams) {
				const parsedStatusId = parseInt(statusIdFromParams);
				absenceRequestsSearchStore.setAbsenceRequestStatusId(parsedStatusId);
				return parsedStatusId;
			}
			return absenceRequestsSearchStore.absenceRequestStatusId;
		})(),
		year: (() => {
			if (isFirstLoad) {
                const yearFromParams = searchParams.get("year");
                if (yearFromParams) {
                    const parsedYear = parseInt(yearFromParams);
                    absenceRequestsSearchStore.setYear(parsedYear);
                    return parsedYear;
                }
                const currentYear = new Date().getFullYear();
                absenceRequestsSearchStore.setYear(currentYear);
                setIsFirstLoad(false);
                return currentYear;
            }
            return absenceRequestsSearchStore.year;
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
				<Form className="grid gap-4 w-full xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2 ss:grid-cols-1">
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
						enableTabLoop={false}
						className='border-gray-300 input-select-border w-full min-w-[5rem] md:w-auto'
						locale={i18n.language}
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
						className='border-gray-0 input-select-border w-full min-w-[5rem] md:w-auto'
						locale={i18n.language}
					/>
					<Select
						name="year"
						id="year"
						placeholder={t('SELECT_YEAR')}
						options={yearOptions()}
						className="border-gray-300 input-select-border w-full min-w-[11rem] md:w-auto"
						value={values.year ? { value: values.year, label: values.year.toString(), } : null}
						onChange={(option) => setFieldValue('year', option ? option.value : null)}
						isClearable
						isSearchable
					/>
					<div className='flex gap-4 '>
						<button
							type="submit"
							className="btn-search"
						>
							{t('SEARCH')}
						</button>
						<button
							type="button"
							onClick={() => handleClear(setFieldValue)}
							className="btn-clear"
						>
							{t("CLEAR")}
						</button>
					</div>
				</Form>
			)}
		</Formik >
	);
};