import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from "yup"
import { absenceRequestTypesService } from "../../services";
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export const AbsenceRequestTypesAdd = ({ closeModal, fetchData }) => {
    const { t } = useTranslation();

    const validationSchema = Yup.object({
        name: Yup.string()
        .required(t('NAME_IS_REQUIRED'))
    });

    const addHandling = async (values, actions) => {
        const { setSubmitting } = actions;
        try {
            await absenceRequestTypesService.add(values);
            fetchData();
            closeModal(); 
            toast.success(t('ADDED')); 
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }
        finally{
            setSubmitting(false);
        }
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">{t('NEW_ABSENCE_REQUEST')}</h2>
            <Formik
                initialValues={{
                    name: "",
                    isActive: false,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, actions) => addHandling(values, actions)}
            >
                <Form>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                            {t('NAME')}
                        </label>
                        <Field
                            type="text"
                            id="name"
                            name="name"
                            placeholder={t('ENTER_ABSENCE_REQUEST_TYPE_NAME')}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
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
                
            </Formik>
        </div>
    );
};