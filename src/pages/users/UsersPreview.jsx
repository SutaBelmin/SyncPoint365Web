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
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6 text-center">{t('USER_PREVIEW')}</h1>
      <div className="flex flex-col gap-6">

        <div className="flex flex-col gap-2 border-b pb-4">
          <div className="flex gap-4">
            <span className="font-medium">{t('FIRST_NAME')}:</span>
            <span>{user.firstName}</span>
          </div>
          <div className="flex gap-4">
            <span className="font-medium">{t('LAST_NAME')}:</span>
            <span>{user.lastName}</span>
          </div>
          <div className="flex gap-4">
            <span className="font-medium">{t('EMAIL')}:</span>
            <span>{user.email}</span>
          </div>
        </div>


        <div className="flex flex-col gap-2 border-b pb-4">
          <div className="flex gap-4">
            <span className="font-medium">{t('GENDER')}:</span>
            <span>{translateGender(user.gender)}</span>
          </div>
          <div className="flex gap-4">
            <span className="font-medium">{t('BIRTH_DATE')}:</span>
            <span>{formatDate(user.birthDate)}</span>
          </div>
          <div className="flex gap-4">
            <span className="font-medium">{t('CITY')}:</span>
            <span>{user.cityName}</span>
          </div>
        </div>


        <div className="flex flex-col gap-2">
          <div className="flex gap-4">
            <span className="font-medium">{t('ADDRESS')}:</span>
            <span>{user.address}</span>
          </div>
          <div className="flex gap-4">
            <span className="font-medium">{t('PHONE')}:</span>
            <span>{user.phone}</span>
          </div>
          <div className="flex gap-4">
            <span className="font-medium">{t('ROLE')}:</span>
            <span>{translateRole(user.role)}</span>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={closeModal}
        className="btn-common mt-6 w-full flex justify-center mx-auto"
      >
        {t('CLOSE')}
      </button>
    </div>
  );
};
