import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUserTimes, faCity, faEarthAmerica, faUser, faHome, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const SideNavbar = ({ isCollapsed, onToggle }) => {
    const { t } = useTranslation();

    

    return (
        <nav className={`bg-gray-800 text-white h-full p-4 fixed top-0 left-0 z-50 transition-all duration-300 
            ${isCollapsed ? '' : 'bg-transparent'}`}
        >
            <div className="flex justify-between items-center mb-8">
                <button className="text-white" onClick={onToggle}>
                    <FontAwesomeIcon
                        icon={faBars}
                        className={`text-2xl ${isCollapsed ? 'text-white' : 'text-black'}`} />
                </button>
            </div>

            {isCollapsed && (
                <ul className="space-y-4">
                    {[{ icon: faHome, label: t('HOME'), link: '/home' },
                    { icon: faUser, label: t('USERS'), link: '/users' },
                    { icon: faEarthAmerica, label: t('COUNTRIES'), link: '/countries' },
                    { icon: faCity, label: t('CITIES'), link: '/cities' },
                    { icon: faUserTimes, label: t('REQUEST_TYPES'), link: '/absence-request-types' },
                    { icon: faCalendarCheck, label: t('ABSENCE_REQUESTS'), link: '/absence-requests' }
                    ].map(({ icon, label, link }) => (
                        <li key={label} className="flex items-center hover:bg-gray-700 py-2 px-4 rounded">
                            <FontAwesomeIcon icon={icon} className="mr-3" />
                            <a href={link} className="text-lg">{label}</a>
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
};

export default SideNavbar;