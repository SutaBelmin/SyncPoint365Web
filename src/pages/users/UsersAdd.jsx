import React from 'react';
import { useTranslation } from 'react-i18next';

export const UsersAdd = () => {
    const { t } = useTranslation();

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">{t('USERS_ADD')}</h1>
        </div>
    );
};
