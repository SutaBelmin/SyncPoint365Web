import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import LanguageSwitcher from '../localization';
import { useTranslation } from 'react-i18next';

const Header = () => {
    const { t } = useTranslation();

    return (
        <header className="text-white flex justify-end items-center h-16 px-6 shadow-md fixed left-0 right-0 z-10">
            <div className="flex items-center">
                <LanguageSwitcher />
            </div>
            <a href="/" className="flex items-center text-sm hover:text-gray-500 transition-all duration-150">
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-black" />
                <span className="text-black">{t('LOG_OUT')}</span>
            </a>
        </header>
    );
};

export default Header;