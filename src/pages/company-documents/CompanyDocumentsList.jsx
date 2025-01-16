import { useTranslation } from 'react-i18next';

export const CompanyDocumentsList = () => {
     const { t } = useTranslation();

    return (
        <div className="pl-3">
            <h1 className="h1">{t('COMPANY_DOCUMENTS')}</h1>
            
        </div>
    );
};