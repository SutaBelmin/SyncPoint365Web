import React from "react";
import { useTranslation } from "react-i18next";
import { genderConstant } from "../../constants/constants";
import { formatPhoneNumber } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import './UsersList.css';

export const UsersPreview = ({ user, closeModal }) => {
  const { t } = useTranslation();

  const formatDate = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("bs-BA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date)).replace(/-/g, "/");
  };

  const translateGender = (gender) => {
    if (gender === genderConstant.male) return t('MALE');
    else return t('FEMALE');
  };

  return (
    <div className="p-6">
      <h1 className="flex justify-center items-center mb-4 text-3xl font-semibold text-gray-900">{t('USER_PREVIEW')}</h1>
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-2 border-b border-gray-300 gap-y-2">
          <div></div>
          <div className="flex flex-col gap-3 pb-4">
            <div className="flex gap-4 pt-16  ml-auto">
              <span className="text-gray-900 font-semibold text-2xl ml:auto">{`${user.firstName} ${user.lastName}`}</span>
            </div>
            <div className="flex gap-4 ml-auto">
              <span className="text-gray-600"><FontAwesomeIcon icon={faEnvelope} className="pr-1" /> {user.email}</span>
            </div>
            <div className="flex gap-4 ml-auto">
              <span className="text-gray-600"><FontAwesomeIcon icon={faPhone} className="pr-2" />
                {formatPhoneNumber(user.phone)}</span>
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="font-medium text-gray-600">{t('BIRTH_DATE')}:</span>
              <span className="text-gray-600">{formatDate(user.birthDate)}</span>
            </div>
            <div className="flex flex-col ml-auto">
              <span className="font-medium text-gray-600 ml-auto">{t('ADDRESS')}:</span>
              <span className="text-gray-600">{`${user.address}, ${user.cityName}`}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="pt-4">
              <span className="font-medium text-gray-600 pr-1">{t('STATUS')}:</span>
              <span className="text-gray-600">{user.isActive ? t('ACTIVE') : t('INACTIVE')}</span>
            </div>
            <div className="pt-4 ml-auto">
              <span className="font-medium text-gray-600 pr-1">{t('GENDER')}:</span>
              <span className="text-gray-600">{translateGender(user.gender)}</span>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={closeModal}
        className="mt-8 w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-sm transition duration-200"
      >
        {t('CLOSE')}
      </button>
    </div >
  );

};  
