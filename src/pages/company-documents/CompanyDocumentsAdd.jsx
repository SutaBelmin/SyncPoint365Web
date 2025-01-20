import React from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import companyDocumentsService from '../../services/companyDocumentsService';
import { toast } from 'react-toastify';
import * as Yup from "yup";
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthProvider';

export const CompanyDocumentsAdd = ({ onClose, fetchData }) => {
    const { t } = useTranslation();
    const { loggedUser } = useAuth();

    const handleSubmit = async (values) => {
        try {
            const newCompanyDocument = {
                ...values,
                userId: loggedUser.id
            };

            await companyDocumentsService.add(newCompanyDocument);
            toast.success(t('ADDED'));
            fetchData();
            onClose();
        } catch (error) {

        }
    };

    const validationSchema = Yup.object({
        name: Yup.string().required(t('NAME_IS_REQUIRED')),
        file: Yup.string().required(t('FILE_IS_REQUIRED')),
    });

    return (
        <div className="p-6 max-w-full">
            <h1 className="text-xl font-bold mb-4">{t('ADD_NEW_DOCUMENT')}</h1>

            <Formik
                initialValues={{ file: null, name: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, values }) => (
                    <Form className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-md font-medium">{t('NAME')}</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                onChange={(e) => setFieldValue("name", e.target.value)}
                                className="mt-2 p-2 border border-gray-300 rounded w-full"
                            />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label htmlFor="file" className="block text-md font-medium">{t('FILE')}</label>
                            <input
                                id="file"
                                name="file"
                                type="file"
                                onChange={(e) => setFieldValue("file", e.target.files[0])}
                                className="mt-2 p-2 border border-gray-300 rounded w-full"
                            />
                            <ErrorMessage name="file" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label htmlFor="isVisible" className="block text-md font-medium">{t('VISIBILITY')}</label>
                            <input 
                               id="isVisible"
                               name="isVisible"
                               type="checkbox"
                               checked={values.isVisible}
                               onChange={() => setFieldValue("isVisible", !values.isVisible)}
                               className="mt-2"
                            />
                        </div>

                        <div className='flex justify-end'>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                            >
                               {t('SAVE')}
                            </button>
                        </div>

                    </Form>
                )}
            </Formik>
        </div>
    );
};
