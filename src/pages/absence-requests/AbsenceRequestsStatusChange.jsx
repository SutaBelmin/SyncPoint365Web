import { Formik, Form, Field } from "formik";
import { useTranslation } from 'react-i18next';
import { absenceRequestsService, enumsService } from "../../services";
import { toast } from 'react-toastify';
import Select from 'react-select';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { absenceRequestStatusConstant } from "../../constants";
import { format } from "date-fns";

export const AbsenceRequestsStatusChange = ({ absenceRequest, closeModal, fetchData, isStatusLocked }) => {
    const [statuses, setAbsenceRequestsStatuses] = useState([]);
    const { t } = useTranslation();

    const fetchAbsenceRequestStatus = useCallback(async () => {
        try {
            const response = await enumsService.getAbsenceRequestsStatus();
            const statusOptions = response.data
                .filter(requestStatus => requestStatus.label !== absenceRequestStatusConstant.pending)
                .map(requestStatus => ({
                    value: requestStatus.id,
                    label: requestStatus.label === absenceRequestStatusConstant.approved ? t('APPROVED') :
                        requestStatus.label === absenceRequestStatusConstant.rejected ? t('REJECTED') :
                            requestStatus.label
                }));
            setAbsenceRequestsStatuses(statusOptions);
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }
    }, [t]);

    useEffect(() => {
        fetchAbsenceRequestStatus();
    }, [fetchAbsenceRequestStatus]);

    const saveAbsenceRequestStatus = async (values) => {
        try {
            await absenceRequestsService.changeAbsenceRequestStatus({
                id: absenceRequest.id,
                status: values.absenceRequestStatus,
                postComment: values.postComment
            });
            toast.success(t('STATUS_SUCCESSFULLY_CHANGED'));
            fetchData();
            closeModal();
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }
    };

    const initialValues = {
        absenceRequestId: absenceRequest.id,
        absenceRequestStatus: absenceRequest.status,
        postComment: null,
    }

    return (
        <div className="p-6 bg-white rounded-2xl z-20 relative">
            <button
                onClick={closeModal}
                className="absolute -top-2 -right-1 text-gray-400 hover:text-gray-600 focus:outline-none text-xl"
            >
                <FontAwesomeIcon icon={faTimes} />
            </button>

            <div className="flex justify-center items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">{t('ABSENCE_REQUEST')}</h2>
            </div>

            <Formik
                initialValues={initialValues}
                onSubmit={saveAbsenceRequestStatus}
            >
                {({ setFieldValue, values }) => (
                    <Form>
                        <div>
                            <div className="grid grid-cols-1 gap-y-4">
                                <div className="pb-3 flex items-center justify-center text-center">
                                    <span className="text-gray-900 text-xl font-semibold">{absenceRequest.absenceRequestType?.name}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-6">
                                    <div className="flex flex-col">
                                        <span className="font-medium pr-2 text-gray-600">{t('APPLICANT')}:</span>
                                        <span className="text-gray-900">{`${absenceRequest.user?.firstName || ''} ${absenceRequest.user?.lastName || ''}`.trim()}</span>
                                    </div>
                                    <div className="flex flex-col pl-8">
                                        <span className="font-medium text-gray-600">{t('STATUS')}:</span>
                                        <span className="text-gray-900">
                                            {absenceRequest.absenceRequestStatus === absenceRequestStatusConstant.pending
                                                ? t('PENDING')
                                                : absenceRequest.absenceRequestStatus === absenceRequestStatusConstant.approved
                                                    ? t('APPROVED') : t('REJECTED')}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-x-6">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-600">{t('DATE_FROM')}:</span>
                                        <span className="text-gray-900">{`${format(new Date(absenceRequest.dateFrom), t('DATE_FORMAT'))}`}</span>
                                    </div>
                                    <div className="flex flex-col pl-8">
                                        <span className="font-medium text-gray-600">{t('DATE_TO')}:</span>
                                        <span className="text-gray-900">{`${format(new Date(absenceRequest.dateTo), t('DATE_FORMAT'))}`}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-x-6">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-600">{t('DATE_RETURN')}:</span>
                                        <span className="text-gray-900">{format(new Date(absenceRequest.dateReturn), t('DATE_FORMAT'))}</span>
                                    </div>
                                </div>
                                <div className="pb-2">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        {t('EMPLOYEE_COMMENT')}:
                                    </label>
                                    <div className="mt-1 block bg-white p-1.5 border border-gray-300 rounded-md shadow-sm select-none min-h-[3.5rem]" id="preComment">
                                        <span
                                            id="preComment"
                                            className="text-gray-700">{absenceRequest.preComment && absenceRequest.preComment.trim() ? absenceRequest.preComment : null}</span>
                                    </div>

                                </div>
                                {!isStatusLocked && (
                                    <div>
                                        <div>
                                            <div className="border-t border-gray-400 pb-4"></div>
                                        <label className="text-sm font-medium text-gray-700" id="absenceRequestStatus">
                                                {t('REQUEST_STATUS')}
                                            </label>
                                            <Select
                                                id="absenceRequestStatus"
                                                name="absenceRequestStatus"
                                                value={statuses.find(requestStatus => requestStatus.value === values.absenceRequestStatus) || null}
                                                onChange={(option) => setFieldValue('absenceRequestStatus', option && option.value)}
                                                options={statuses}
                                                placeholder={t('SELECT_STATUS')}
                                                className="border-blue-400 input-select-border w-full min-w-[11rem] md:w-auto"
                                                isClearable
                                                isSearchable
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700" id="postComment">
                                                {t('COMMENT')}
                                            </label>
                                            <Field
                                                id="postComment"
                                                as="textarea"
                                                rows="2"
                                                name="postComment"
                                                placeholder={t('COMMENT')}
                                                autoComplete="off"
                                                className="mt-1 mb-4 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div className="flex justify-end pt-5 space-x-2">
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
                                                {t('SAVE')}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {isStatusLocked && (
                                    <>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1" id="postComment">
                                            {t('ADMIN_COMMENT')}:
                                        </label>
                                            <span
                                                id="postComment"
                                                className="mt-1 block bg-white p-1.5 text-gray-700 border border-gray-300 rounded-md shadow-sm select-none min-h-[3.5rem]"
                                                >{absenceRequest.postComment && absenceRequest.postComment.trim() ? absenceRequest.postComment : null}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="mt-3 w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-sm transition duration-200"
                                        >
                                            {t('CLOSE')}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div >
    );
};
