import { Formik, Form } from "formik";
import { useTranslation } from 'react-i18next';
import { absenceRequestsService, enumsService } from "../../services";
import { toast } from 'react-toastify';
import Select from 'react-select';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { absenceRequestStatusConstant } from "../../constants";


export const AbsenceRequestsChangeStatus = ({ absenceRequestId, absenceRequestStatus, closeModal, onCancel, fetchData }) => {
    const [statuses, setAbsenceRequestsStatuses] = useState([]);
    const { t } = useTranslation();


    const fetchAbsenceRequestStatus = useCallback(async () => {
        try {
            const response = await enumsService.getAbsenceRequestsStatus();
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
    }, [t]);

    useEffect(() => {
        fetchAbsenceRequestStatus();
    }, [fetchAbsenceRequestStatus]);

    const handleConfirm = async (values) => {
        try {
            await absenceRequestsService.changeAbsenceRequestStatus(absenceRequestId, values.absenceRequestStatus);
            toast.success(t('STATUS_SUCCESSFULLY_CHANGED'));
            fetchData();
            closeModal();
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }
    };


    const initialValues = {
        absenceRequestStatusId: absenceRequestId,
        absenceRequestStatus: absenceRequestStatus,
    }

    return (
        <div className="p-6 bg-white rounded-2xl relative">
            <button
                onClick={closeModal}
                className="absolute -top-2 -right-1 text-gray-400 hover:text-gray-600 focus:outline-none text-xl"
            >
                <FontAwesomeIcon icon={faTimes} />
            </button>

            <div className="flex justify-center items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">{t('CHANGE_ABSENCE_REQUEST_STATUS_TO')}</h2>
            </div>

            <Formik
                initialValues={initialValues}
                onSubmit={handleConfirm}
            >
                {({ setFieldValue, values }) => (
                    <Form>
                        <div>
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
                        </div>
                        <div className="flex justify-center pt-12 space-x-4 pt-4">
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
                    </Form>
                )}
            </Formik>
        </div>
    );
};
