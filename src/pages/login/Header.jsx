import React from 'react';
import LanguageSwitcher from '../../components/localization';

const Header = () => {
    return (
        <header className="text-white flex justify-end items-center h-16 px-6 shadow-md">
            <div className="mr-4">
                <LanguageSwitcher />
            </div>
        </header>
    );
};

export default Header;
