import { useCallback, useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import companyDocumentsService from '../../services/companyDocumentsService';
import { useRequestAbort } from "../../components/hooks/useRequestAbort";
import DataTable from "react-data-table-component";

export const CompanyDocumentsList = () => {
    const [data, setData] = useState([]);
    const { signal } = useRequestAbort();
    const { t } = useTranslation();

    const fetchData = useCallback(async () => {
        try {
            const response = await companyDocumentsService.getList(signal);
            setData(response.data.items);
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }
    }, [signal, t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const columns = [
        {
            name: t('DOCUMENT_NAME'),
            selector: row => row.name, 
            sortable: true,
        },
        {
            name: t('CONTENT_TYPE'),
            selector: row => row.contentType, 
            sortable: true,
        },
        {
            name: "IS_VISIBLE",
            selector: row => (row.isVisible ? "Yes" : "No"), 
            sortable: true,
        },
        {
            name: "USER_ID",
            selector: row => row.userId,
            sortable: true,
        },
    ];

    return (
        <div className="pl-3">
            <h1 className="h1">{t('COMPANY_DOCUMENTS')}</h1>
            <div>
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    highlightOnHover
                />
            </div>
        </div>
    );
};