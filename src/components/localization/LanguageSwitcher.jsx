import React, { useState } from "react";
import { FlagIcon } from "react-flag-kit"; 
import { useTranslation } from 'react-i18next';


const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();
 
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem("selectedLanguage") || i18n.language;
  });
  
  const languages = [
    { code: "en-US", label: "English", flag: "US" },
    { code: "bs", label: "Bosnian", flag: "BA" },
  ];
  
  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLanguageChange = (code) => {
    setSelectedLanguage(code);
    setIsOpen(false);
    i18n.changeLanguage(code);
    localStorage.setItem("selectedLanguage", code);
  };

  const selectedFlag = languages.find((lang) => lang.code === selectedLanguage)?.flag;

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md text-gray-800 hover:bg-gray-200"
        onClick={toggleDropdown}
      >
        <FlagIcon code={selectedFlag} className="w-6 h-4" />
      </button>

      {isOpen && (
        <ul className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md text-gray-800">
          {languages.map((lang) => (
            <li
              key={lang.code}
              className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                lang.code === selectedLanguage ? "font-bold" : ""
              }`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <FlagIcon code={lang.flag} className="w-6 h-4" />
              {lang.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;


