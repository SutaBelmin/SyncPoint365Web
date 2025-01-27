import React from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { companyDocumentsService } from '../../services';
import { useRequestAbort } from "../../components/hooks";
import { allowedDocumentExtensions } from '../../constants';

export const CompanyDocumentsEdit = ({ companyDocument, closeModal, fetchData }) => {
    const { t } = useTranslation();
    const { signal } = useRequestAbort();

    const validationSchema = Yup.object({
        name: Yup.string().required(t('NAME_IS_REQUIRED'))
    });

    const handleSubmit = async (values) => {
        try {
            const newCompanyDocument = {
                ...values,
                id: companyDocument.id
            };

            await companyDocumentsService.update(newCompanyDocument, signal);
            toast.success(t('UPDATED'));
            fetchData();
            closeModal();
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }
    };

    return (
        <div className="p-6 max-w-full">
            <h1 className="text-xl font-bold mb-4">{t('UPDATE_DOCUMENT')}</h1>

            <Formik
                initialValues={{
                    file: null,
                    name: companyDocument?.name || '',
                    isVisible: companyDocument?.isVisible || false
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, values }) => (
                    <Form className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('NAME')}</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={values.name}
                                onChange={(e) => setFieldValue("name", e.target.value)}
                                className="mt-2 p-2 border border-gray-300 rounded w-full"
                            />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label htmlFor="file" className="block text-sm font-medium text-gray-700">{t('FILE')}</label>
                            <input
                                id="file"
                                name="file"
                                type="file"
                                accept={allowedDocumentExtensions}
                                onChange={(e) => setFieldValue("file", e.target.files[0])}
                                className="mt-2 p-2 border border-gray-300 rounded w-full"
                            />
                            <ErrorMessage name="file" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="flex justify-end gap-4 pt-2">
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
                )}
            </Formik>
        </div>
    );
}