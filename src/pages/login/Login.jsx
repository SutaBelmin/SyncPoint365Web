import React from 'react';
import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { authService } from '../../services';
import LanguageSwitcher from '../../components/localization';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().required(t('EMAIL_IS_REQUIRED')),
    password: Yup.string().required(t('PASSWORD_IS_REQUIRED'))
  });

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      await authService.login(values.email, values.password);
      navigate('/home');
      toast.success(t('WELCOME'));
    } catch (err) {
      toast.error(t('FAILED_LOGIN'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center">
      <header className="text-white flex justify-end items-center h-16 px-6 shadow-md">
            <div className="mr-4">
                <LanguageSwitcher />
            </div>
        </header>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
          <div className="mx-auto h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center mt-4">
            <FontAwesomeIcon icon={faUser} className="text-white text-2xl" />
          </div>
          <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
            {t('SIGN_IN_TO_YOUR_ACCOUNT')}
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                    Email
                  </label>
                  <div className="mt-2">
                    <Field
                      id="email"
                      name="email"
                      type="text"
                      placeholder="Email"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                      {t('PASSWORD')}
                    </label>
                    <div className="text-sm">
                      <a href="/" className="font-semibold text-black hover:text-gray-700">
                        {t('FORGOT_PASSWORD?')}
                      </a>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      placeholder={t('PASSWORD')}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full justify-center rounded-md bg-gray-800 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                  >
                    {t('SIGN_IN')}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;