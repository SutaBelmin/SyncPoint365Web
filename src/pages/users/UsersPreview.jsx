import React from "react";
import { useTranslation } from "react-i18next";

export const UsersPreview = ({ user, closeModal }) => {
  const { t } = useTranslation();

  const formatDate = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("bs-BA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
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
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6 text-center text-gray-800">{t('USER_PREVIEW')}</h1>
      <div className="flex flex-col gap-8">
  
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-700">{t('PERSONAL_INFORMATION')}</h2>
          <div className="flex flex-col gap-2 border-b border-gray-300 pb-4">
            <div className="flex gap-4">
              <span className="font-medium text-gray-600">{t('FIRST_NAME')}:</span>
              <span className="text-gray-900">{user.firstName}</span>
            </div>
            <div className="flex gap-4">
              <span className="font-medium text-gray-600">{t('LAST_NAME')}:</span>
              <span className="text-gray-900">{user.lastName}</span>
            </div>
            <div className="flex gap-4">
              <span className="font-medium text-gray-600">{t('GENDER')}:</span>
              <span className="text-gray-900">{translateGender(user.gender)}</span>
            </div>
            <div className="flex gap-4">
              <span className="font-medium text-gray-600">{t('BIRTH_DATE')}:</span>
              <span className="text-gray-900">{formatDate(user.birthDate)}</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-700">{t('CONTACT_INFORMATION')}</h2>
          <div className="flex flex-col gap-2">
            <div className="flex gap-4">
              <span className="font-medium text-gray-600">{t('EMAIL')}:</span>
              <span className="text-gray-900">{user.email}</span>
            </div>
            <div className="flex gap-4">
              <span className="font-medium text-gray-600">{t('PHONE')}:</span>
              <span className="text-gray-900">{user.phone}</span>
            </div>
            <div className="flex gap-4">
              <span className="font-medium text-gray-600">{t('CITY')}:</span>
              <span className="text-gray-900">{user.cityName}</span>
            </div>
            <div className="flex gap-4">
              <span className="font-medium text-gray-600">{t('ADDRESS')}:</span>
              <span className="text-gray-900">{user.address}</span>
            </div>
          </div>
        </div>
      </div>
  
      <button
        type="button"
        onClick={closeModal}
        className="mt-6 w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-sm transition duration-200"
      >
        {t('CLOSE')}
      </button>
    </div>
  );
  
};  
