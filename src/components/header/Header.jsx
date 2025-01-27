import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import LanguageSwitcher from '../localization';
import { useTranslation } from 'react-i18next';
import './Header.css';
import { useAuth } from '../../context/AuthProvider';
import { toast } from "react-toastify";
import { usersService } from '../../services';
import { defaultUserImage } from '../../assets/images';

const Header = ({ isCollapsed }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { removeUser } = useAuth();
    const { loggedUser } = useAuth();
    const [profilePicture, setProfilePicture] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        removeUser();
        navigate('/');
    }

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const fetchUserImage = useCallback(async () => {
        try {
            const user = await usersService.getById(loggedUser.id);
            const userImage = user.data.imageContent ? `data:image/jpeg;base64,${user.data.imageContent}` : defaultUserImage;
            setProfilePicture(userImage);
        } catch (error) {
            toast.error(t('ERROR_LOADING_USER'));
        }
    }, [loggedUser.id, t]);

    useEffect(() => {
        if (loggedUser)
            fetchUserImage();
    }, [loggedUser, fetchUserImage]);

    return (
        <header className={`header-comp ${isCollapsed ? 'header-collapsed' : ''}`}>
            <div className="header-actions">
                <h1 className="header-font">
                    <span className="text-custom-blue">SyncPoint</span>
                    <span className="text-yellow-600">365</span>
                </h1>

                <div className="mr-3">
                    <LanguageSwitcher />
                </div>

                <div className="flex items-center gap-2 relative mr-8 ">
                    <div
                        onClick={toggleDropdown}
                        className="cursor-pointer flex items-center gap-2 relative"
                    >
                        {profilePicture && (
                            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-300">
                                <img
                                    src={profilePicture}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <span className='hide-for-small'>{loggedUser.firstName}</span>
                    </div>

                    {isDropdownOpen && (
                        <div
                            className="absolute top-[calc(100%+8px)] left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-lg w-32 z-10"
                        >
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-300 rotate-45"></div>
                            <ul className="flex flex-col text-sm">
                                <li
                                    onClick={handleLogout}
                                    className="py-2 px-4 hover:bg-gray-100 cursor-pointer text-black"
                                >
                                    <FontAwesomeIcon
                                        icon={faSignOutAlt}
                                        className="mr-2 text-black"
                                    />
                                    {t('LOG_OUT')}
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
};

export default Header;
