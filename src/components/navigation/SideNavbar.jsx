import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUserTimes, faCity, faEarthAmerica, faUser, faHome } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const SideNavbar = ({ isCollapsed, onToggle }) => {
  const { t } = useTranslation();

  return (
    <nav
      className={`bg-gray-800 text-white p-4 fixed top-0 left-0 z-50 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      style={{ minHeight: '100%' }} 
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-xl font-semibold ${isCollapsed ? 'hidden' : ''}`}>SyncPoint365</h1>
        <button className="text-white" onClick={onToggle}>
          <FontAwesomeIcon icon={faBars} className="text-2xl" />
        </button>
      </div>

      <ul className={`space-y-4 mt-4 ${isCollapsed ? 'hidden' : ''}`}>
        <li className="flex items-center hover:bg-gray-700 py-2 px-4 rounded">
          <FontAwesomeIcon icon={faHome} className="mr-3" />
          <a href="/home" className="text-lg">{t('HOME')}</a>
        </li>
        <li className="flex items-center hover:bg-gray-700 py-2 px-4 rounded">
          <FontAwesomeIcon icon={faUser} className="mr-3" />
          <a href="/users" className="text-lg">{t('USERS')}</a>
        </li>
        <li className="flex items-center hover:bg-gray-700 py-2 px-4 rounded">
          <FontAwesomeIcon icon={faEarthAmerica} className="mr-3" />
          <a href="/countries" className="text-lg">{t('COUNTRIES')}</a>
        </li>
        <li className="flex items-center hover:bg-gray-700 py-2 px-4 rounded">
          <FontAwesomeIcon icon={faCity} className="mr-3" />
          <a href="/cities" className="text-lg">{t('CITIES')}</a>
        </li>
        <li className="flex items-center hover:bg-gray-700 py-2 px-4 rounded">
          <FontAwesomeIcon icon={faUserTimes} className="mr-3" />
          <a href="/absenceRequestTypes" className="text-lg">{t('REQUEST_TYPES')}</a>
        </li>
      </ul>

      <div className={`mt-4 flex flex-col items-center space-y-4 ${isCollapsed ? '' : 'hidden'}`}>
        <a href="/home">
          <FontAwesomeIcon icon={faHome} className="text-white text-2xl" />
        </a>
        <a href="/users">
          <FontAwesomeIcon icon={faUser} className="text-white text-2xl" />
        </a>
        <a href="/countries">
          <FontAwesomeIcon icon={faEarthAmerica} className="text-white text-2xl" />
        </a>
        <a href="/cities">
          <FontAwesomeIcon icon={faCity} className="text-white text-2xl" />
        </a>
        <a href="/absenceRequestTypes">
          <FontAwesomeIcon icon={faUserTimes} className="text-white text-2xl" />
        </a>
      </div>
    </nav>
  );
};

export default SideNavbar;
