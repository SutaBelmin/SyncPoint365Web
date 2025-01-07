import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCity, faEarthAmerica, faUser, faHome, faCalendarCheck, faCaretDown, faLocationCrosshairs, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { roleConstant } from '../../constants';

const SideNavbar = ({ isCollapsed, onToggle }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [activeLink, setActiveLink] = useState('');
    const [openDropdown, setOpenDropdown] = useState(null);
    const { userHasRole } = useAuth();

    const handleLinkClick = (e, path, isChild = false) => {
        e.preventDefault();
        setActiveLink(path);

        if (!isChild)
            setOpenDropdown(null);

        navigate(path);
    }

    const toggleDropdown = (e, dropdown) => {
        e.stopPropagation();
        setOpenDropdown(prevState => (prevState === dropdown ? null : dropdown));
    }

    const userHasAnyRole = () => {
        return userHasRole(roleConstant.superAdministrator) || userHasRole(roleConstant.administrator) || userHasRole(roleConstant.employee);
    };

    const menuItems = [
        { icon: faHome, label: t('HOME'), link: '/home', isVisible: userHasAnyRole() },
        { icon: faUser, label: t('USERS'), link: '/users', isVisible: userHasAnyRole() && !userHasRole(roleConstant.employee) },
        { icon: faCalendarCheck, label: t('REQUEST_TYPES'), link: '/absence-request-types', isVisible: userHasAnyRole() && !userHasRole(roleConstant.employee) },
        { icon: faCalendarDays, label: t('ABSENCE_REQUESTS'), link: '/absence-requests', isVisible: userHasAnyRole() && !userHasRole(roleConstant.employee) },
        { icon: faCalendarDays, label: t('ABSENCE_REQUESTS'), link: '/absence-requests-user', isVisible: userHasRole(roleConstant.employee) },
        { icon: faLocationCrosshairs, label: t('LOCATION'), link: null, isVisible: userHasAnyRole() && !userHasRole(roleConstant.employee),
            items: [
                { icon: faEarthAmerica, label: t('COUNTRIES'), link: '/countries' },
                { icon: faCity, label: t('CITIES'), link: '/cities' },
            ],
        },
    ];

    return (
        <nav
            className={`bg-gray-800 text-white h-full p-4 fixed top-0 left-0 z-50 transition-all duration-300 ${isCollapsed ? '' : 'bg-transparent'} ${isCollapsed ? 'w-64' : 'w-0'}`}
        >
            <div className="flex justify-between items-center mb-8">
                <button className="text-white" onClick={onToggle}>
                    <FontAwesomeIcon
                        icon={faBars}
                        className={`text-2xl ${isCollapsed ? 'text-white' : 'text-black'}`}
                    />
                </button>
            </div>
            {isCollapsed && (
                <ul className="space-y-4">
                    {menuItems.filter(({ isVisible }) => isVisible).map(({ icon, label, link, items }) => (
                        <li key={label}>
                            {items ? (
                                <div>
                                    <div
                                        className="flex items-center w-full py-2 px-4 text-lg rounded hover:bg-gray-700 cursor-pointer"
                                        onClick={(e) => toggleDropdown(e, label)}
                                    >
                                        <FontAwesomeIcon icon={icon} className="mr-3" />
                                        {label}
                                        <FontAwesomeIcon
                                            icon={faCaretDown}
                                            className={`ml-auto transform ${openDropdown === label ? 'rotate-180' : ''} transition-transform`}
                                        />
                                    </div>
                                    {openDropdown === label && (
                                        <ul className="ml-6 mt-2 space-y-2">
                                            {items.map(({ icon, label, link }) => (
                                                <li key={label}>
                                                    <a
                                                        href={link}
                                                        onClick={(e) => handleLinkClick(e, link, true)}
                                                        className={`block py-2 px-4 text-md rounded hover:bg-gray-600 ${activeLink === link ? 'bg-gray-700' : ''
                                                            }`}
                                                    >
                                                        <FontAwesomeIcon icon={icon} className="mr-3" />
                                                        {label}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                <a
                                    href={link}
                                    onClick={(e) => handleLinkClick(e, link)}
                                    className={`flex items-center w-full py-2 px-4 text-lg rounded hover:bg-gray-700 ${activeLink === link ? 'bg-gray-700' : ''
                                        }`}
                                >
                                    <FontAwesomeIcon icon={icon} className="mr-3" />
                                    {label}
                                </a>
                            )}
                        </li>
                    ))}
                </ul>

            )}
        </nav>
    );
};

export default SideNavbar;
