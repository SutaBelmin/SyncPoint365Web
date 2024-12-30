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

export const AbsenceRequestsSearchUser = ({ fetchData }) => {
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

	const yearOptions = () => {
		const currentYear = new Date().getFullYear();
		const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
		return years.map(year => ({ value: year, label: year.toString() }));
	};

	const handleYearChange = (selectedOption) => {
		if (selectedOption) {
			const selectedYear = selectedOption.value;
			const dateFrom = new Date(selectedYear, 0, 1);
			const dateTo = new Date(selectedYear, 11, 31);
			//setFieldValue("year", selectedOption);
		};
	}
		useEffect(() => {
			setSearchParams(absenceRequestsSearchStore.queryParams);
		}, [setSearchParams]);

		useEffect(() => {
			fetchAbsenceRequestTypes();
		}, [fetchAbsenceRequestTypes]);


		const handleSearch = (values) => {
			absenceRequestsSearchStore.setAbsenceTypeId(values.absenceRequestTypeId);
			absenceRequestsSearchStore.setAbsenceRequestStatusId(values.absenceRequestStatusId);
			absenceRequestsSearchStore.setDateFrom(values.dateFrom);
			absenceRequestsSearchStore.setDateTo(values.dateTo);

			const queryParams = absenceRequestsSearchStore.syncWithQueryParams();
			setSearchParams(queryParams);
			fetchData();
		};


		const handleClear = (setFieldValue) => {
			setSearchParams({});
			setFieldValue("absenceRequestTypeId", null);
			setFieldValue("absenceRequestStatusId", null);
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
							name="year"
							id="year"
							placeholder={t('SELECT_YEAR')}
							options={yearOptions()}
							className="border-gray-300 input-select-border w-full min-w-[10rem] md:w-auto"
							onChange={(option) => setFieldValue('year', option ? option.value : null)}
							isClearable
							isSearchable
							autoComplete='off'
							locale={i18n.language}
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