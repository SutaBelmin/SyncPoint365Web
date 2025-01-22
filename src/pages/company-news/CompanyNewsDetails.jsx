import { t } from 'i18next';
import React from 'react';

export const CompanyNewsDetails = ({ title, content, date }) => {

    if (!content) {
		return <div>{t('LOADING')}</div>;
	}

    return (
        <div className="p-8 bg-white rounded-lg">
            <h2 className="text-xl font-bold mb-8">{title}</h2>
            <p className="mb-10">{content}</p>
            <small className="text-gray-500">{new Date(date).toLocaleString()}</small>
        </div>
    );
};

