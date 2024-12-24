import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import LanguageSwitcher from '../localization';
import { useTranslation } from 'react-i18next';
import './Header.css';

const Header = ({ isCollapsed }) => {
    const { t } = useTranslation();

    return (
        <header className={`header-comp ${isCollapsed ? 'header-collapsed' : ''}`}>
            <div className="header-actions">
                <h1 className="header-font">
                    <span className="text-blue-800">SyncPoint</span>
                    <span className="text-yellow-400">365</span>
                </h1>
                <LanguageSwitcher />
                <a
                    href="/"
                    className="flex items-center text-sm hover:text-gray-500"
                >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-black" />
                    <span className="text-black">{t('LOG_OUT')}</span>
                </a>
            </div>
        </header>
    );
};

export default Header;
