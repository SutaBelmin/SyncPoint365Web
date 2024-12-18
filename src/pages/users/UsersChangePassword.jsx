import { Formik, Form, Field, ErrorMessage } from "formik";
import { useTranslation } from 'react-i18next';
import { usersService } from "../../services";
import { toast } from 'react-toastify';
import * as Yup from "yup";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const UsersChangePassword = ({ userId, onCancel, fetchData, closeModal }) => {
    const { t } = useTranslation();
    const [seePassword, setSeePassword] = useState(false);
    const [seePasswordConfirmation, setSeePasswordConfirmation] = useState(false);


    const validationSchema = Yup.object({
        password: Yup.string()
            .required(t('PASSWORD_IS_REQUIRED'))
            .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/, t('PASSWORD_REQUIREMENTS')),
        passwordConfirmation: Yup.string()
            .required(t('PASSWORD_CONFIRM_IS_REQUIRED'))
            .oneOf([Yup.ref('password')], t('PASSWORDS_MUST_MATCH'))
    });

    const handleSubmit = async (values) => {
        try {
            await usersService.changePassword(userId, values.password);
            toast.success(t('ADDED'));
            fetchData();
            closeModal();
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">{t('CHANGE_PASSWORD')}</h2>
            <Formik
                initialValues={{
                    userId,
                    password: "",
                    passwordConfirmation: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                <Form className="mb-4">
                    <div className="ml-2 relative group">
                        <label className="mt-1block text-sm pr-2 font-medium text-gray-700" htmlFor="password">
                            {t('NEW_PASSWORD')}
                        </label>
                        <i className="fas fa-info-circle text-gray-500 hover:text-indigo-500 cursor-pointer"></i>
                        <div className="hidden absolute top-7 left-0 w-max z-20 bg-gray-700 text-white text-xs rounded-md p-2 shadow-md group-hover:block">
                            {t('PASSWORD_RULES')
                                .split('\n')
                                .map((line, index) => (
                                    <p key={index}>{line}</p>
                                ))}
                        </div>
                    </div>
                    <div className="relative">
                        <Field
                            type={seePassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            placeholder={t('NEW_PASSWORD')}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <FontAwesomeIcon icon={seePassword ? faEyeSlash : faEye}
                            onClick={() => setSeePassword(!seePassword)}
                            className="absolute right-3 top-3 text-gray-500" />

                    </div>
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                    <label className="mt-1 block text-sm font-medium text-gray-700" htmlFor="passwordConfirmation">
                        {t('PASSWORD_CONFIRMATION')}
                    </label>
                    <div className="relative">
                        <Field
                            type={seePasswordConfirmation ? 'text' : 'password'}
                            id="passwordConfirmation"
                            name="passwordConfirmation"
                            placeholder={t('PASSWORD_CONFIRMATION')}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <FontAwesomeIcon icon={seePasswordConfirmation ? faEyeSlash : faEye}
                            onClick={() => setSeePasswordConfirmation(!seePasswordConfirmation)}
                            className="absolute right-3 top-3 text-gray-500" />

                    </div>
                    <ErrorMessage name="passwordConfirmation" component="div" className="text-red-500 text-sm" />

                    <div className="flex justify-end pt-2 space-x-2">
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