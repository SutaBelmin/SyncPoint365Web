import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import LanguageSwitcher from '../localization';
import { useTranslation } from 'react-i18next';
import './Header.css';
import { useAuth } from '../../context/AuthProvider';

const Header = ({ isCollapsed }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { removeUser } = useAuth();

    const handleLogout = () => {
        removeUser();
        navigate('/');
    }

    return (
        <header className={`header-comp ${isCollapsed ? 'header-collapsed' : ''}`}>
            <div className="header-actions">
                <h1 className="header-font">
                    <span className="text-custom-blue">SyncPoint</span>
                    <span className="text-yellow-600">365</span>
                </h1>
                <LanguageSwitcher />
                <button
                    onClick={handleLogout}
                    className="flex items-center text-sm hover:text-gray-500"
                >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-black" />
                    <span className="text-black">{t('LOG_OUT')}</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
