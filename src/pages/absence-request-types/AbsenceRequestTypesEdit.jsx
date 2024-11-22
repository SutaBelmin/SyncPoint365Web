import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from "yup"
import { absenceRequestTypesService } from "../../services";
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";

export const AbsenceRequestTypesEdit = ({ absenceRequestType, closeModal, fetchData }) => {
    const { t } = useTranslation();

    const validationSchema = Yup.object({
        name: Yup.string().required(t('NAME_IS_REQUIRED'))
    });

    const editHandling = async (values, actions) => {
        const { setSubmitting } = actions;
        try {
            await absenceRequestTypesService.update({
                id: absenceRequestType.id,
                name: values.name,
                isActive: values.isActive,
            });
            fetchData();
            closeModal(); 
            toast.success("Absence request type updated successfully!");
        } catch (error) {
            toast.error("Failed to update absence request type. Please try again.");
        }
        finally{
            setSubmitting(false);
        }
    }


    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">{t('EDIT_ABSENCE_REQUEST')}</h2>
            <Formik
                initialValues={{
                    id: absenceRequestType.id,
                    name: absenceRequestType.name,
                    isActive: absenceRequestType.isActive,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, actions) => editHandling(values, actions)}
            >
                <Form>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            {t('NAME')}
                        </label>
                        <Field
                            type="text"
                            id="name"
                            name="name"
                            placeholder={t('ENTER_YOUR_NAME')}
                            className="w-full p-2 border rounded"
                        />
                </div>
                    <div className="mb-4 flex items-center">
                        <Field
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            className="mr-2"
                        />
                        <label htmlFor="isActive" className="text-sm font-bold text-gray-700">
                            {t('ACTIVE')}
                        </label>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="rounded bg-gray-500 text-white px-4 py-2 hover:bg-gray-400 mr-2"
                        >
                            {t('CANCEL')}
                        </button>
                        <button
                            type="submit"
                            className="rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-500"
                        >
                            {t('SAVE')} 
                        </button>
                    </div>
                </Form>
                
            </Formik>
        </div>
    );


}