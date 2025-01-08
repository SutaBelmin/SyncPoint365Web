import React, { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from 'react-i18next';
import { registerLocale } from "react-datepicker";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { Formik, Form } from 'formik';
import { useRequestAbort } from "../../../components/hooks/useRequestAbort";
import { absenceRequestsSearchStore } from '../stores';
import { absenceRequestTypesService } from '../../../services';
import { localeConstant } from '../../../constants';
import { yearOptions } from '../../../utils';

export const AbsenceRequestsSearchEmployeeView = ({ fetchData }) => {
	const [isFirstLoad, setIsFirstLoad] = useState(true);
	const [absenceRequestTypes, setAbsenceRequestTypes] = useState([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const { t, i18n } = useTranslation();
	const { signal } = useRequestAbort();

	registerLocale(i18n.language, localeConstant[i18n.language]);

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

	useEffect(() => {
		setSearchParams(absenceRequestsSearchStore.queryParams);
	}, [setSearchParams]);

	useEffect(() => {
		fetchAbsenceRequestTypes();
	}, [fetchAbsenceRequestTypes]);

	const searchAbsenceRequests = (values) => {
		absenceRequestsSearchStore.setAbsenceTypeId(values.absenceRequestTypeId);
		absenceRequestsSearchStore.setYear(values.year);

		const queryParams = absenceRequestsSearchStore.syncWithQueryParams();
		setSearchParams(queryParams);
		fetchData();
	};

	const handleClear = (setFieldValue) => {
		setSearchParams({});
		setFieldValue("absenceRequestTypeId", null);
		setFieldValue("absenceRequestStatusId", null);
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
	}

	return (
		<Formik
			enableReinitialize
			initialValues={initialValues}
			onSubmit={searchAbsenceRequests}
		>
			{({ setFieldValue, values }) => (
				<Form className="grid gap-4 w-full xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2 ss:grid-cols-1">
					<Select
						name="absenceRequestTypeId"
						id="absenceRequestTypeId"
						placeholder={t('ABSENCE_REQUEST_TYPE')}
						options={absenceRequestTypes}
						value={values.absenceRequestTypeId ? { value: values.absenceRequestTypeId, label: absenceRequestTypes.find(a => a.value === values.absenceRequestTypeId)?.label } : null}
						onChange={(option) => setFieldValue('absenceRequestTypeId', option ? option.value : null)}
						className="border-gray-300 input-select-border w-full min-w-[10rem] md:w-auto"
						isClearable
						isSearchable
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
					<div className='flex gap-4 xs:w-full'>
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