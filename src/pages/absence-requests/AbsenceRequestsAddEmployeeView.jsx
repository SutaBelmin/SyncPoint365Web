import React, { useState, useEffect, useCallback } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Select from "react-select";
import * as Yup from "yup";
import { absenceRequestsService, absenceRequestTypesService } from "../../services";
import { useRequestAbort } from "../../components/hooks";
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { absenceRequestStatusConstant } from '../../constants';

export const AbsenceRequestsAddEmployeeView = ({ userId, closeModal, fetchData }) => {
    const [absenceRequestTypes, setAbsenceRequestTypes] = useState([]);
    const { t } = useTranslation();
    const { signal } = useRequestAbort();
    const nextYear = new Date().getFullYear() + 1;
    const maxDate = new Date(nextYear, 11, 31);

    const fetchAbsenceRequestTypes = useCallback(async () => {
        try {
            const response = await absenceRequestTypesService.getLookupList(signal);
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
        fetchAbsenceRequestTypes();
    }, [t, fetchAbsenceRequestTypes]);

    const initialValues = {
        absenceRequestTypeId: null,
        dateFrom: null,
        dateTo: null,
        dateReturn: null,
        preComment: '',
    };

    const validationSchema = Yup.object().shape({
        absenceRequestTypeId: Yup.string().required(t('TYPE_IS_REQUIRED')),
        dateFrom: Yup.date().required(t('DATE_FROM_IS_REQUIRED'))
            .max(Yup.ref('dateTo'), t('DATE_FROM_MUST_BE_BEFORE_OR_EQUAL_DATE_TO')),
        dateTo: Yup.date().required(t('DATE_TO_IS_REQUIRED'))
            .min(Yup.ref('dateFrom'), t('DATE_TO_MUST_BE_AFTER_OR_EQUAL_DATE_FROM')),
        dateReturn: Yup.date().required(t('RETURN_DATE_IS_REQUIRED'))
            .min(Yup.ref('dateTo'), t('RETURN_DATE_MUST_BE_AFTER_DATE_TO'))
            .test('is-one-day-after', t('RETURN_DATE_MUST_BE_AFTER_DATE_TO'),
                function (value) {
                    const { dateTo } = this.parent;
                    if (dateTo && value) {
                        const oneDayAfterDateTo = new Date(dateTo);
                        oneDayAfterDateTo.setDate(oneDayAfterDateTo.getDate() + 1);
                        return value >= oneDayAfterDateTo;
                    }
                    return true;
                }
            ),
        preComment: Yup.string(),
    });


    const addAbsenceRequest = async (values, actions) => {
        const { setSubmitting } = actions;
        try {
            await absenceRequestsService.add({
                dateFrom: values.dateFrom,
                dateTo: values.dateTo,
                dateReturn: values.dateReturn,
                absenceRequestStatus: absenceRequestStatusConstant.pending,
                preComment: values.preComment,
                postComment: null,
                absenceRequestTypeId: values.absenceRequestTypeId,
                userId: userId
            }, signal);
            fetchData();
            closeModal();
            toast.success(t('ADDED'));
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">{t('ADD_ABSENCE_REQUEST')}</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={addAbsenceRequest}
            >
                {({ setFieldValue, values }) => (
                    <Form>
                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700 mb-1" >
                                {t('ABSENCE_REQUEST_TYPE')}
                            </label>
                            <Select
                                name="absenceRequestTypeId"
                                id="absenceRequestTypeId"
                                options={absenceRequestTypes}
                                value={absenceRequestTypes.find(option => option.value === values.absenceRequestTypeId)}
                                onChange={(option) => setFieldValue('absenceRequestTypeId', option.value)}
                                isSearchable
                                placeholder={t('SELECT_TYPE')}
                                className="h-10 border-gray-300 input-select-border w-full"
                            />
                            <ErrorMessage name="absenceRequestTypeId" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="mb-4">
                            <div className="flex space-x-4 mb-3">
                                <div className="flex flex-col w-1/2">
                                    <label className="text-sm font-medium text-gray-700 mb-1" >
                                        {t('DATE_FROM')}
                                    </label>
                                    <DatePicker
                                        id='dateFrom'
                                        name="dateFrom"
                                        selected={values.dateFrom ? new Date(values.dateFrom) : null}
                                        onChange={(date) => {
                                            const formattedDate = format(new Date(date), 'yyyy-MM-dd');
                                            setFieldValue('dateFrom', formattedDate);
                                        }}
                                        dateFormat={t('DATE_FORMAT')}
                                        placeholderText={t('DATE_FROM')}
                                        showYearDropdown
                                        maxDate={maxDate}
                                        autoComplete='off'
                                        yearDropdownItemNumber={100}
                                        scrollableYearDropdown
                                        className='h-10 border-gray-300 max-w-[11rem] rounded-md'
                                    />
                                    <ErrorMessage name="dateFrom" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div className="flex flex-col w-1/2">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        {t('DATE_TO')}
                                    </label>
                                    <DatePicker
                                        id='dateTo'
                                        name="dateTo"
                                        selected={values.dateTo ? new Date(values.dateTo) : null}
                                        onChange={(date) => {
                                            const formattedDate = format(new Date(date), 'yyyy-MM-dd');
                                            setFieldValue('dateTo', formattedDate);
                                        }}
                                        dateFormat={t('DATE_FORMAT')}
                                        placeholderText={t('DATE_TO')}
                                        showYearDropdown
                                        maxDate={maxDate}
                                        autoComplete='off'
                                        yearDropdownItemNumber={100}
                                        scrollableYearDropdown
                                        className='h-10 border-gray-300 max-w-[11rem] rounded-md'
                                    />
                                    <ErrorMessage name="dateTo" component="div" className="text-red-500 text-sm" />
                                </div>
                            </div>

                            <div className="flex flex-col w-1/2">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    {t('DATE_RETURN')}
                                </label>
                                <DatePicker
                                    id='dateReturn'
                                    name="dateReturn"
                                    selected={values.dateReturn ? new Date(values.dateReturn) : null}
                                    onChange={(date) => {
                                        const formattedDate = format(new Date(date), 'yyyy-MM-dd');
                                        setFieldValue('dateReturn', formattedDate);
                                    }}
                                    dateFormat={t('DATE_FORMAT')}
                                    placeholderText={t('DATE_OF_RETURN')}
                                    showYearDropdown
                                    maxDate={maxDate}
                                    autoComplete='off'
                                    yearDropdownItemNumber={100}
                                    scrollableYearDropdown
                                    className='h-10 border-gray-300 max-w-[11rem] rounded-md'
                                />
                                <ErrorMessage name="dateReturn" component="div" className="text-red-500 text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                {t('COMMENT')}
                            </label>
                            <Field
                                type="text"
                                id="preComment"
                                as="textarea"
                                rows="4"
                                name="preComment"
                                placeholder={t('COMMENT')}
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