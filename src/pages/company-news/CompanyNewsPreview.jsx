import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { t } from 'i18next';
import React from 'react';
import DOMPurify from 'dompurify';

export const CompanyNewsPreview = ({ title, content, date, closeModal }) => {

    if (!content) {
        return <div>{t('LOADING')}</div>;
    }

    const sanitizedContent = DOMPurify.sanitize(content); 

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg w-full max-w-5xl max-h-[65vh] min-h-[300px] flex flex-col relative">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-6 text-gray-500 hover:text-gray-700 text-xl z-10"
                >
                    <FontAwesomeIcon icon={faX}/>
                </button>
                <div className="p-8 pt-10">
                    <h2 className="text-2xl font-bold mb-2 pl-7">{title}</h2>
                    <small className="text-gray-500 block mb-4 pl-7">{new Date(date).toLocaleString()}</small>
                    <hr className="border-t border-gray-300 mb-4 ml-7 mr-10" />
                </div>
                <div className="px-8 overflow-y-auto flex-grow mb-[5%]">
                    <div className="prose max-w-none pl-7 pr-7 text-justify pb-8">
                        <div dangerouslySetInnerHTML={{__html: sanitizedContent}}/>
                    </div>

                </div>
                <button
                        type="button"
                        onClick={closeModal}
                        className="w-1/6 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-sm transition duration-200 ml-[76%] mb-4"
                    >
                        {t('CLOSE')}
                    </button>
            </div>
        </div>
    );
};