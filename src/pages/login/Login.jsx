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
import { useAuth } from '../../context/AuthProvider';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const validationSchema = Yup.object({
    email: Yup.string().required(t('EMAIL_IS_REQUIRED')),
    password: Yup.string().required(t('PASSWORD_IS_REQUIRED'))
  });


  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await authService.login(values.email, values.password);
      const { user, accessToken, refreshToken } = response;
      setUser(user, accessToken, refreshToken);
      navigate('/home');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error(t('INVALID_CREDENTIALS'));
      } else if (error.response && error.response.status === 403) {
        toast.error(t('ACCOUNT_INACTIVE'));
      } else {
        toast.error(t('FAILED_LOGIN'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center">
      <header className="text-white flex justify-between items-center h-16 px-6 shadow-md">
        <h1 className="header-font" style={{ paddingLeft: '0rem' }}>
          <span className="text-custom-blue">SyncPoint</span>
          <span className="text-yellow-600">365</span>
        </h1>
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
                      autoComplete="on"
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