import React from 'react';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();

    return (
        <div className="p-8">
            <h2 className="h1 text-2xl font-bold mb-4">{t('WELCOME_TO_HOME_SCREEN')}</h2>
        </div>
    );
};

export default Home;