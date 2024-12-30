import { Formik, Form } from "formik";
import { useTranslation } from 'react-i18next';
import { absenceRequestsService, enumsService } from "../../services";
import { toast } from 'react-toastify';
import Select from 'react-select';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { absenceRequestStatusConstant } from "../../constants";
import { format } from "date-fns";


export const AbsenceRequestsChangeStatus = ({ absenceRequest, absenceRequestTypeName, userName, absenceRequestId, closeModal, fetchData, isStatusLocked }) => {
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

    const handleConfirm = async (values) => {
        try {
            await absenceRequestsService.changeAbsenceRequestStatus({
                id: absenceRequestId,
                newStatus: values.absenceRequestStatus
            });
            toast.success(t('STATUS_SUCCESSFULLY_CHANGED'));
            fetchData();
            closeModal();
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }
    };


    const initialValues = {
        absenceRequestStatusId: absenceRequest.id,
        absenceRequestStatus: absenceRequest.status,
    }

    return (
        <div className="p-6 bg-white rounded-2xl relative">
            <button
                onClick={closeModal}
                className="absolute -top-2 -right-1 text-gray-400 hover:text-gray-600 focus:outline-none text-xl"
            >
                <FontAwesomeIcon icon={faTimes} />
            </button>

            <div className="flex justify-center items-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-800">{t('ABSENCE_REQUEST')}</h2>
            </div>

            <Formik
                initialValues={initialValues}
                onSubmit={handleConfirm}
            >
                {({ setFieldValue, values }) => (
                    <Form>
                        <div>

                            <div className="grid grid-cols-2 pl-8 gap-x-6 gap-y-4">
                                <div className="pb-3 flex flex-col">
                                    <span className="font-medium pr-2 text-gray-600">{t('APPLICANT')}:</span>
                                    <span className="text-gray-900">{userName}</span>
                                </div>
                                <div className="pb-3 flex flex-col">
                                    <span className="pr-2 font-medium text-gray-600">{t('STATUS')}:</span>
                                    <span className="text-gray-900">
                                        {absenceRequest.absenceRequestStatus === absenceRequestStatusConstant.pending ? t('PENDING')
                                            : absenceRequest.absenceRequestStatus === absenceRequestStatusConstant.approved ? t('APPROVED') : t('REJECTED')}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-600">{t('ABSENCE_REQUEST_TYPE')}:</span>
                                    <span className="text-gray-900">{absenceRequestTypeName}</span>
                                </div>
                                <div className="flex flex-col ">
                                    <span className="font-medium text-gray-600">{t('DATE_RETURN')}:</span>
                                    <span className="text-gray-900">{format(new Date(absenceRequest.dateReturn), t('DATE_FORMAT'))}</span>
                                </div>
                                <div className="flex flex-col ">
                                    <span className="font-medium text-gray-600">{t('DATE_FROM')}:</span>
                                    <span className="text-gray-900">{format(new Date(absenceRequest.dateFrom), t('DATE_FORMAT'))}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-600">{t('DATE_TO')}:</span>
                                    <span className="text-gray-900">{format(new Date(absenceRequest.dateTo), t('DATE_FORMAT'))}</span>
                                </div>
                            </div>


                            {!isStatusLocked && (
                                <div className="mt-4">
                                    <Select
                                        id="absenceRequestStatus"
                                        name="absenceRequestStatus"
                                        value={statuses.find(requestStatus => requestStatus.value === values.absenceRequestStatus) || null}
                                        onChange={(option) => setFieldValue('absenceRequestStatus', option && option.value)}
                                        options={statuses}
                                        placeholder={t('SELECT_STATUS')}
                                        className="border-gray-300 pt-4 input-select-border w-full min-w-[11rem] md:w-auto"
                                        isClearable
                                        isSearchable
                                    />
                                    <div className="flex justify-center pt-8 space-x-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="px-6 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none"
                                        >
                                            {t('CANCEL')}
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none"
                                        >
                                            {t('CONFIRM')}
                                        </button>
                                    </div>
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={closeModal}
                                className="mt-6 w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-sm transition duration-200"
                            >
                                {t('CLOSE')}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};
