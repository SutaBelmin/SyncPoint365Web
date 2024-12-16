import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { userService } from "../../services";
import { toast } from 'react-toastify';
import * as Yup from "yup";


export const UsersChangePassword = ({ closeModal, onCancel, fetchData }) => {
    const { t } = useTranslation();


    const validationSchema = Yup.object({
        roleId: Yup.string().required(t('USER_ID_REQUIRED')),
        newPassword: Yup.string()
            .required(t('PASSWORD_IS_REQUIRED'))
            .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/, t('PASSWORD_RULES')),
        repeatPassword: Yup.string()
            .required(t('PASSWORD_CONFIRM_IS_REQUIRED'))
            .oneOf([Yup.ref('password')], t('PASSWORDS_MUST_MATCH'))
    });

    const handleSubmit = async (values) => {
        try {
            await userService.passwordChange(values);
            toast.success(t('ADDED'));
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">{t('CHANGE_PASSWORD')}</h2>
            <Formik
                initialValues={{
                    userId: null,
                    newPassword: "",
                    repeatPassword: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                    <Form className="mb-4">
                        <label className="mt-1block text-sm font-medium text-gray-700" htmlFor="userID">
                            {t('USER_ID')}
                        </label>
                        <Field
                            type="text"
                            id="userID"
                            name="userID"
                            placeholder={t('USER_ID')}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <label className="mt-1block text-sm font-medium text-gray-700" htmlFor="newPassword">
                            {t('NEW_PASSWORD')}
                        </label>
                        <div className="ml-2 relative group">
                                        <i className="fas fa-info-circle text-gray-500 hover:text-indigo-500 cursor-pointer"></i>
                                        <div className="hidden absolute top-7 left-0 w-max bg-gray-700 text-white text-xs rounded-md p-2 shadow-md group-hover:block">
                                            <p dangerouslySetInnerHTML={{ __html: t('PASSWORD_RULES').replace(/\n/g, '<br />') }} />
                                        </div>
                                    </div>
                        <Field
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            placeholder={t('NEW_PASSWORD')}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm" />
                        <label className="mt-1 block text-sm font-medium text-gray-700" htmlFor="repeatPassword">
                            {t('REPEAT_PASSWORD')}
                        </label>
                        <Field
                            type="text"
                            id="repeatPassword"
                            name="repeatPassword"
                            placeholder={t('REPEAT_PASSWORD')}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <ErrorMessage name="repeatPassword" component="div" className="text-red-500 text-sm" />
                        
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={onCancel}
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
            </Formik>


        </div>

    );
}