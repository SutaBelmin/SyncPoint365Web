import React from "react";
import { useTranslation } from 'react-i18next';

const NoDataMessage = () => {
    const { t } = useTranslation();

    return (
        <div className="no-data-message">
            {t('NO_ITEMS_TO_DISPLAY')}
        </div>
    );
};

export default NoDataMessage;
