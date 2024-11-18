import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import LanguageSwitcher from '../localization/LanguageSwitcher';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const isSignInPage = location.pathname === '/';

  return (
    <header className="text-white flex justify-end items-center h-16 px-6 shadow-md">
      <div className="mr-4">
        <LanguageSwitcher />
      </div>

      {!isSignInPage && (
        <a href="/" className="flex items-center hover:text-gray-300">
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-black" />
          <span className="text-black">Log Out</span>
        </a>
      )}
    </header>
  );
};

export default Header;
