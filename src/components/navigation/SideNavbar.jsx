import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUserTimes, faCity, faEarthAmerica, faUser, faHome } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const SideNavbar = () => {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <nav
      className={`bg-gray-800 text-white h-full p-4 fixed top-0 left-0 z-50 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-xl font-semibold ${isCollapsed ? 'hidden' : ''}`}>SyncPoint365</h1>
        <button
          className="text-white md:hidden"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <FontAwesomeIcon icon={faBars} className="text-2xl" />
        </button>
      </div>

      <ul className="space-y-4 mt-4">
        <li className="flex items-center hover:bg-gray-700 py-2 px-4 rounded">
          <FontAwesomeIcon icon={faHome} className="mr-3" />
          <a href="/home" className={`text-lg ${isCollapsed ? 'hidden' : ''}`}>
            {t('HOME')}
          </a>
        </li>
        <li className="flex items-center hover:bg-gray-700 py-2 px-4 rounded">
          <FontAwesomeIcon icon={faUser} className="mr-3" />
          <a href="/users" className={`text-lg ${isCollapsed ? 'hidden' : ''}`}>
            {t('USERS')}
          </a>
        </li>
        <li className="flex items-center hover:bg-gray-700 py-2 px-4 rounded">
          <FontAwesomeIcon icon={faEarthAmerica} className="mr-3" />
          <a href="/countries" className={`text-lg ${isCollapsed ? 'hidden' : ''}`}>
            {t('COUNTRIES')}
          </a>
        </li>
        <li className="flex items-center hover:bg-gray-700 py-2 px-4 rounded">
          <FontAwesomeIcon icon={faCity} className="mr-3" />
          <a href="/cities" className={`text-lg ${isCollapsed ? 'hidden' : ''}`}>
            {t('CITIES')}
          </a>
        </li>
        <li className="flex items-center hover:bg-gray-700 py-2 px-4 rounded">
          <FontAwesomeIcon icon={faUserTimes} className="mr-3" />
          <a href="/absenceRequestTypes" className={`text-lg ${isCollapsed ? 'hidden' : ''}`}>
            {t('REQUEST_TYPES')}
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default SideNavbar;
