import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import * as Yup from "yup"
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";
import { absenceRequestsService, absenceRequestTypesService, userService } from '../../services';
import { format } from 'date-fns';

export const AbsenceRequestsEdit = ({ absenceRequest, closeModal, fetchData }) => {
	const [absenceRequestTypes, setAbsenceRequestTypes] = useState([]);
	const [users, setUsers] = useState([]);

	const { t } = useTranslation();
	const { i18n } = useTranslation();
	const nextYear = new Date().getFullYear() + 1;
	const maxDate = new Date(nextYear, 11, 31);

	const initialValues = {
		type: absenceRequestTypes.find(type => type.value === absenceRequest?.typeId) || null,
		dateFrom: absenceRequest?.dateFrom ? new Date(absenceRequest.dateFrom) : new Date(),
		dateTo: absenceRequest?.dateTo ? new Date(absenceRequest.dateTo) : new Date(),
		dateReturn: absenceRequest?.dateReturn ? new Date(absenceRequest.dateReturn) : new Date(),
		comment: absenceRequest?.comment || ''
	};



	useEffect(() => {
		const fetchTypeUserId = async () => {
			try {
				const responseAbsenceType = await absenceRequestTypesService.getList();
				const optionsAbsenceType = responseAbsenceType.data.map(absenceRequestType => ({
					value: absenceRequestType.id,
					label: absenceRequestType.name
				}));
				setAbsenceRequestTypes(optionsAbsenceType);

				const responseUsers = await userService.getUsers();
				const optionsUsers = responseUsers.data.map(user => ({
					value: user.id,
					label: user.name
				}));
				setUsers(optionsUsers);
			} catch (error) {
				toast.error(t('ERROR_FETCHING_ABSENCE_TYPES'));
			}
		};
		fetchTypeUserId();
	}, [t]);


	const validationSchema = Yup.object().shape({
		type: Yup.string().required(t('NAME_IS_REQUIRED')),
		dateFrom: Yup.date()
			.required(t('NAME_IS_REQUIRED')),
		dateTo: Yup.date()
			.required(t('NAME_IS_REQUIRED'))
			.min(Yup.ref('dateFrom'),
				t('NAME_IS_REQUIRED')),
		dateReturn: Yup.date().min(
			Yup.ref('dateTo' + 1),
			t('NAME_IS_REQUIRED'))
	});

	const editHandling = async (values, actions) => {
		const { setSubmitting } = actions;
		try {
			await absenceRequestsService.update({
				//userId: userId.id,
				id: absenceRequest.id,
				type: values.type.value,
				dateFrom: values.dateFrom,
				dateTo: values.dateTo,
				dateReturn: values.dateReturn,
				comment: values.comment
			});
			fetchData();
			closeModal();
			toast.success(t('UPDATED'));
		} catch (error) {
			toast.error(t('FAIL_UPDATE'));
		}
		finally {
			setSubmitting(false);
		}
	}

	return (
		<div className='p-4'>
			<h2 className="text-xl font-semibold mb-4">Edit Absence Request</h2>
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={editHandling}
			>
				{({ setFieldValue, values }) => (
					<Form className="space-y-4">
						<div>
							<Select
								name="type"
								placeholder="Select Type"
								options={absenceRequestTypes}
								value={values.type}
								onChange={(option) => setFieldValue('type', option)}
								isSearchable
								className="h-10 border-gray-300 input-select-border w-full mb-2"
							/>
							<ErrorMessage name="type" component="div" className="text-red-500 text-sm" />

						</div>
						<div className="mb-4">
							<div className="flex space-x-4 mb-3">
								<div className="flex flex-col w-1/2">
									<label className="text-sm font-medium text-gray-700 mb-1">
										Date From
									</label>
									<DatePicker
										id='dateFrom'
										name="dateFrom"
										selected={values.dateFrom ? new Date(values.dateFrom) : null}
										onChange={(date) => {
											const formattedDate = format(new Date(date), 'yyyy-MM-dd');
											setFieldValue('dateFrom', formattedDate);
										}}
										dateFormat={i18n.language === 'en-US' ? "MM/dd/yyyy" : "dd/MM/yyyy"}
										placeholderText="Select date from"
										showYearDropdown
										maxDate={maxDate}
										autoComplete='off'
										yearDropdownItemNumber={100}
										scrollableYearDropdown
										className='h-10 border-gray-300 max-w-[11rem] rounded-md'
									/>
								</div>
								<div className="flex flex-col w-1/2">
									<label className="text-sm font-medium text-gray-700 mb-1">
										Date To
									</label>
									<DatePicker
										id='dateTo'
										name="dateTo"
										selected={values.dateTo ? new Date(values.dateTo) : null}
										onChange={(date) => {
											const formattedDate = format(new Date(date), 'yyyy-MM-dd');
											setFieldValue('dateTo', formattedDate);
										}}
										dateFormat={i18n.language === 'en-US' ? "MM/dd/yyyy" : "dd/MM/yyyy"}
										placeholderText="Select date to"
										showYearDropdown
										maxDate={maxDate}
										autoComplete='off'
										yearDropdownItemNumber={100}
										scrollableYearDropdown
										className='h-10 border-gray-300 max-w-[11rem] rounded-md'
									/>
								</div>
							</div>

							<div className="flex flex-col w-1/2">
								<label className="text-sm font-medium text-gray-700 mb-1">
									Date Return
								</label>
								<DatePicker
									id='dateReturn'
									name="dateReturn"
									selected={values.dateReturn ? new Date(values.dateReturn) : null}
									onChange={(date) => {
										const formattedDate = format(new Date(date), 'yyyy-MM-dd');
										setFieldValue('dateReturn', formattedDate);
									}}
									dateFormat={i18n.language === 'en-US' ? "MM/dd/yyyy" : "dd/MM/yyyy"}
									placeholderText="Select date of return"
									showYearDropdown
									maxDate={maxDate}
									autoComplete='off'
									yearDropdownItemNumber={100}
									scrollableYearDropdown
									className='h-10 border-gray-300 max-w-[11rem] rounded-md'
								/></div>
							<ErrorMessage name="birthDate" component="div" className="text-red-500 text-sm" />
						</div>
						<ErrorMessage name="name" component="div" className="text-red-500 text-sm" />

						<div>
							<label className="text-sm font-medium text-gray-700 mb-1">
								Comment
							</label>
							<Field
								type="block"
								id="name"
								as="textarea"
								rows="4"
								name="name"
								placeholder="Comment field"
								autoComplete="off"
								className="mt-1 mb-4 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>
						<div className="flex justify-end gap-4">
							<button
								type="button"
								onClick={closeModal}
								className="btn-cancel"
							>
								{t('CANCEL')}
							</button>
							<button
								type="submit"
								className="btn-save"
							>
								{t('ADD')}
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
};
