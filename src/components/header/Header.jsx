import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import LanguageSwitcher from '../localization';
import { useTranslation } from 'react-i18next';

const Header = () => {
    const { t } = useTranslation();

    return (
        <header className="text-white flex justify-end items-center h-16 px-6 shadow-md">
            <div className="mr-4">
                <LanguageSwitcher />
            </div>
            <a href="/" className="flex items-center hover:text-gray-300">
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-black" />
                <span className="text-black">{t('LOG_OUT')}</span>
            </a>
        </header>
    );
};

export default Header;