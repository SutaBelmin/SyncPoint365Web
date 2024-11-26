import { useTranslation } from 'react-i18next';


export const PaginationOptions = () => {
    const { t } = useTranslation();
    
    return {
        rowsPerPageText: t('ROWS_PER_PAGE'),
        rangeSeparatorText: t('OF'),
    };
}