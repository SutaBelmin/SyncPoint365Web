import { useCallback, useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import companyDocumentsService from '../../services/companyDocumentsService';
import { useRequestAbort } from "../../components/hooks/useRequestAbort";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { CompanyDocumentsSearch } from './search/CompanyDocumentsSearch';
import companyDocumentsSearchStore from './stores/CompanyDocumentsSearchStore';

export const CompanyDocumentsListEmployeeView = () => {
    const [data, setData] = useState([]);
    const { signal } = useRequestAbort();
    const { t } = useTranslation();

    const fetchData = useCallback(async () => {
        try {
            const filter = {
                ...companyDocumentsSearchStore.companyDocumentFilter
            };

            const response = await companyDocumentsService.getList(filter, signal);

            setData(response.data.items);
            companyDocumentsSearchStore.setTotalItemCount(response.data.totalItemCount);
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
            name: t('USER'),
            selector: row => `${row.user.firstName} ${row.user.lastName}`,
            sortable: true,
        },
        {
            name: t('ACTIONS'),
            cell: row => (
                <div className="flex">
                    <button
                        onClick={() => handleDownload(row.name, row.file, row.contentType)}
                        className="text-lg text-blue-500 hover:underline p-2">
                        <FontAwesomeIcon icon={faFileDownload} style={{ color: '#276EEC' }} />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
        }
    ];

    const handleDownload = (name, file, contentType) => {
        const link = document.createElement('a');
        link.href = decodeFile(file, contentType);
        link.download = name;
        link.click();
    };

    const decodeFile = (base64String, contentType) => {
        const binaryString = atob(base64String);
        const byteArray = Uint8Array.from(binaryString, char => char.charCodeAt(0));
        const blob = new Blob([byteArray], { type: contentType });
        return URL.createObjectURL(blob);
    };

    return (
        <div className="pl-3">
            <h1 className="h1">{t('COMPANY_DOCUMENTS')}</h1>

            <CompanyDocumentsSearch fetchData={fetchData}/>

            <div className='pt-5'>
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