import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from "yup"
import { absenceRequestTypesService } from "../../services";
import { useRequestAbort } from "../../components/hooks";
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";
import { HexColorPicker } from "react-colorful";

export const AbsenceRequestTypesEdit = ({ absenceRequestType, closeModal, fetchData }) => {
    const { t } = useTranslation();
    const { signal } = useRequestAbort();

    const validationSchema = Yup.object({
        name: Yup.string().required(t('NAME_IS_REQUIRED')),
        color: Yup.string()
                    .required(t('COLOR_IS_REQUIRED')),
    });

    const editAbsenceRequestType = async (values, actions) => {
        const { setSubmitting } = actions;
        try {
            await absenceRequestTypesService.update({
                id: absenceRequestType.id,
                name: values.name,
                isActive: values.isActive,
                color: values.color
            }, signal);
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
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">{t('EDIT_ABSENCE_REQUEST')}</h2>
            <Formik
                initialValues={{
                    id: absenceRequestType.id,
                    name: absenceRequestType.name,
                    isActive: absenceRequestType.isActive
                }}
                validationSchema={validationSchema}
                onSubmit={(values, actions) => editAbsenceRequestType(values, actions)}
            >
                {({ setFieldValue, values }) =>
                    <Form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                                {t('NAME')}
                            </label>
                            <Field
                                type="text"
                                id="name"
                                name="name"
                                placeholder={t('ENTER_YOUR_NAME')}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="mb-4 flex items-center">
                            <Field
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                className="mr-2"
                            />
                            <label htmlFor="isActive" className="block text-sm font-medium text-gray-700">
                                {t('ACTIVE')}
                            </label>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="color">
                                {t('CHOOSE_COLOR')} 
                            </label>
                            <HexColorPicker
                                color={values.color}
                                onChange={(color) => setFieldValue("color", color)}
                            />
                            <ErrorMessage name="color" component="div" className="text-red-500 text-sm" />
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
                                {t('SAVE')}
                            </button>
                        </div>
                    </Form>
                }
            </Formik>
        </div>
    );


}