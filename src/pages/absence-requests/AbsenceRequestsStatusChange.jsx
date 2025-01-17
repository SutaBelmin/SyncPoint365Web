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
        absenceRequestStatus: absenceRequest.status || '',
        postComment: absenceRequest.postComment || '',
    }

    return (
        <div className="p-4 bg-white rounded-2xl z-20 relative">
            <button
                onClick={closeModal}
                className="absolute -top-2 -right-1 text-gray-400 hover:text-gray-600 focus:outline-none text-xl"
            >
                <FontAwesomeIcon icon={faTimes} />
            </button>

            <div className="flex justify-center items-center mb-4">
                <h2 className="text-3xl font-semibold text-gray-900">{t('ABSENCE_REQUEST')}</h2>
            </div>

            <Formik
                initialValues={initialValues}
                onSubmit={saveAbsenceRequestStatus}
            >
                {({ setFieldValue, values }) => (
                    <Form>
                        <div>
                            <div className="grid grid-cols-1 gap-y-2">
                                <div className="grid grid-cols-1 gap-y-3">
                                    <div className="flex items-center justify-center text-center">
                                        <span className="text-gray-900 text-xl tracking-wide font-semibold">{`${absenceRequest.user?.firstName || ''} ${absenceRequest.user?.lastName || ''}`}</span>
                                    </div>
                                    <div className="flex items-center justify-center text-center pb-2">
                                        <span className="text-gray-900 tracking-wide">{absenceRequest.absenceRequestType?.name}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-x-16">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-700">{t('DATE_FROM')}:</span>
                                        <span className="text-gray-800 tabular-nums">{`${format(new Date(absenceRequest.dateFrom), t('DATE_FORMAT'))}`}</span>
                                    </div>
                                    <div className="flex flex-col pl-1">
                                        <span className="font-medium text-gray-700">{t('DATE_TO')}:</span>
                                        <span className="text-gray-800 tabular-nums">{`${format(new Date(absenceRequest.dateTo), t('DATE_FORMAT'))}`}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-700">{t('DATE_RETURN')}:</span>
                                        <span className="text-gray-800 tabular-nums">{format(new Date(absenceRequest.dateReturn), t('DATE_FORMAT'))}</span>
                                    </div>
                                </div>
                                <div className="pb-2">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        {t('COMMENT')}:
                                    </label>
                                    <div className="mt-1 mb-3 block bg-gradient-to-r from-gray-100 to-zinc-100 p-1.5 border border-gray-300 rounded-md shadow-sm select-none min-h-[3.5rem]" id="preComment">
                                        <span
                                            id="preComment"
                                            className="text-gray-500">{absenceRequest.preComment && absenceRequest.preComment ? absenceRequest.preComment : null}</span>
                                    </div>
                                </div>
                                <div className="border-t border-gray-300 pb-2"></div>
                                {!isStatusLocked && (
                                    <div>
                                        <div>
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
                                                className="border-blue-400 pb-3 input-select-border w-full min-w-[11rem] md:w-auto"
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
                                                className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                                        <div className="pb-2">
                                            <label className="text-sm font-medium text-gray-700 mb-1">
                                                {t('COMMENT')}:
                                            </label>
                                            <div
                                                className="mt-1 block bg-zinc-100 p-1.5 border border-gray-300 rounded-md shadow-sm select-none min-h-[3.5rem] text-gray-500 whitespace-pre-wrap break-words"
                                                id="preComment"
                                            >
                                                {absenceRequest.preComment && absenceRequest.postComment ? absenceRequest.postComment : null}
                                            </div>
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
