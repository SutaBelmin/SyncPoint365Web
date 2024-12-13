import React from "react";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field } from "formik";


export const UsersPreview = ({ user, closeModal }) => {
  const { t } = useTranslation();

  const formatDate = (date) => {
    if(!date) return "";
    return new Intl.DateTimeFormat("bs-BA", {
        day:"2-digit",
        month:"2-digit",
        year:"numeric"
    }).format(new Date(date));
  };

  const translateRole = (role) => {
    switch (role) {
      case "SuperAdministrator":
        return t('SUPER_ADMINISTRATOR');
      case "Administrator":
        return t('ADMINISTRATOR');
      case "Employee":
        return t('EMPLOYEE');
      default:
        return role;
    }
  };

  const translateGender = (gender) => {
    switch (gender) {
      case "Male":
        return t('MALE');
      case "Female":
        return t('FEMALE');
      default:
        return gender;
    }
  };

  return (
    <div className="p-2">
      <h1 className="text-xl font-bold mb-4 text-center">{t('USER_PREVIEW')}</h1>
      <Formik
        initialValues={{
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          gender: translateGender(user.gender),
          birthDate: formatDate(user.birthDate),
          cityName: user.cityName,
          address: user.address,
          phone: user.phone,
          role: translateRole(user.role),
        }}
      >
        {() => (
          <Form>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('FIRST_NAME')}:
              </label>
              <Field
                name="firstName"
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('LAST_NAME')}:
              </label>
              <Field
                name="lastName"
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('EMAIL')}:
              </label>
              <Field
                name="email"
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('GENDER')}:
              </label>
              <Field
                name="gender"
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('BIRTH_DATE')}:
              </label>
              <Field
                name="birthDate"
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('CITY')}:
              </label>
              <Field
                name="cityName"
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('ADDRESS')}:
              </label>
              <Field
                name="address"
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('PHONE')}:
              </label>
              <Field
                name="phone"
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('ROLE')}:
              </label>
              <Field
                name="role"
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="button"
              onClick={closeModal}
              className="btn-common mt-4 w-full flex justify-center mx-auto"
            >
              {t('CLOSE')}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
