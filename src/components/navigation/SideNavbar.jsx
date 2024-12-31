import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCity, faEarthAmerica, faUser, faHome, faCalendarCheck, faCaretDown, faLocationCrosshairs, faCalendarDays, faCalendarPlus } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const SideNavbar = ({ isCollapsed, onToggle }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [activeLink, setActiveLink] = useState('');
    const [openDropdown, setOpenDropdown] = useState(null);

    const handleLinkClick = (e, path, isChild = false) => {
        e.preventDefault();
        setActiveLink(path);

        if(!isChild)
            setOpenDropdown(null);

        navigate(path);
    }

    const toggleDropdown = (e, dropdown) => {
        e.stopPropagation();
        setOpenDropdown(prevState => (prevState === dropdown ? null : dropdown));
    }

    return (
        <nav className={`bg-gray-800 text-white h-full p-4 fixed top-0 left-0 z-50 transition-all duration-300 
            ${isCollapsed ? '' : 'bg-transparent'} ${isCollapsed ? 'w-64' : 'w-0'}`}
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
                    { icon: faCalendarCheck, label: t('REQUEST_TYPES'), link: '/absence-request-types' },
                    { icon: faCalendarDays, label: t('ABSENCE_REQUESTS'), link: '/absence-requests' },
                    { icon: faCalendarPlus, label: t('ABSENCE_REQUESTS_EMPLOYEE'), link: '/absence-requests-user' }
                    ].map(({ icon, label, link }) => (
                        <li key={label}>
                            <a 
                            href={link} 
                            onClick={(e) => handleLinkClick(e, link)}
                            className={`flex items-center w-full py-2 px-4 text-lg rounded hover:bg-gray-700 ${
                                activeLink === link ? 'bg-gray-700' : ''
                            }`}>
                                <FontAwesomeIcon icon={icon} className="mr-3" />
                                {label}
                            </a>
                        </li>
                    ))}
                    <li>
                        <div>
                            <div 
                              className="flex items-center w-full py-2 px-4 text-lg rounded hover:bg-gray-700 cursor-pointer"
                              onClick={(e) => toggleDropdown(e, 'location')}
                            >
                                <FontAwesomeIcon icon={faLocationCrosshairs} className="mr-3" />
                                {t('LOCATION')}
                                <FontAwesomeIcon
                                    icon={faCaretDown}
                                    className={`ml-auto transform ${openDropdown === 'location' ? 'rotate-180' : ''} transition-transform`}
                                />
                            </div>
                            {openDropdown === 'location' && (
                            <ul className="ml-6 mt-2 space-y-2">
                                <li>
                                    <a
                                        href="/countries"
                                        onClick={(e) => handleLinkClick(e, '/countries', true)}
                                        className={`block py-2 px-4 text-md rounded hover:bg-gray-600 ${
                                            activeLink === '/countries' ? 'bg-gray-700' : ''
                                        }`}
                                    >
                                        <FontAwesomeIcon icon={faEarthAmerica} className="mr-3" />
                                        {t('COUNTRIES')}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/cities"
                                        onClick={(e) => handleLinkClick(e, '/cities', true)}
                                        className={`block py-2 px-4 text-md rounded hover:bg-gray-600 ${
                                            activeLink === '/cities' ? 'bg-gray-700' : ''
                                        }`}
                                    >
                                         <FontAwesomeIcon icon={faCity} className="mr-3" />
                                        {t('CITIES')}
                                    </a>
                                </li>
                            </ul>
                        )}
                        </div>
                    </li>
                </ul>
            )}
        </nav>
    );
};

export default SideNavbar;