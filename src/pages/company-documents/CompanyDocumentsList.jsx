import { useCallback, useEffect, useState, useMemo } from 'react';
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { useSearchParams } from 'react-router-dom';
import DataTable from "react-data-table-component";
import { reaction } from 'mobx';
import debounce from "lodash.debounce";
import { useRequestAbort } from "../../components/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faFileDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import { companyDocumentsService } from '../../services';
import { CompanyDocumentsSearch } from './search';
import { companyDocumentsSearchStore } from './stores';
import { NoDataMessage } from '../../components/common-ui';
import { PaginationOptions } from '../../utils';
import { useModal } from '../../context';
import { useAuth } from '../../context/AuthProvider';
import { ConfirmationModal, DeleteConfirmationModal } from '../../components/modal';
import { BaseModal } from '../../components/modal';
import { CompanyDocumentsAdd, CompanyDocumentsEdit } from '../company-documents';
import { roleConstant } from '../../constants';

export const CompanyDocumentsList = observer(() => {
    const [data, setData] = useState([]);
    const { signal } = useRequestAbort();
    const { t } = useTranslation();
    const paginationComponentOptions = PaginationOptions();
    const [, setSearchParams] = useSearchParams();
    const { openModal, closeModal } = useModal();
    const { loggedUser } = useAuth();
    const isEmployee = loggedUser?.role === roleConstant.employee;

    const fetchData = useCallback(async () => {
        try {
            const filter = {
                ...companyDocumentsSearchStore.companyDocumentFilter,
                isVisible: isEmployee ? true : null
            };
            const response = await companyDocumentsService.getList(filter, signal);

            setData(response.data.items);
            companyDocumentsSearchStore.setTotalItemCount(response.data.totalItemCount);

        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }
    }, [signal, t, isEmployee]);

    const debouncedFetchData = useMemo(() => debounce(fetchData, 100), [fetchData]);

    useEffect(() => {
        const disposeReaction = reaction(
            () => ({
                page: companyDocumentsSearchStore.page,
                pageSize: companyDocumentsSearchStore.pageSize
            }),
            () => {
                debouncedFetchData();
            },
            {
                fireImmediately: true
            }
        );

        return () => disposeReaction();
    }, [debouncedFetchData]);

    const columns = [
        {
            name: t('DOCUMENT_NAME'),
            selector: row => row.name,
            sortable: true,
        },
        !isEmployee &&
        {
            name: t('USER'),
            cell: row => `${row.user.firstName} ${row.user.lastName}`,
            sortable: true,
        },
        !isEmployee &&
        {
            name: t('VISIBILITY'),
            cell: row => (
                <button
                    onClick={() => documentVisibility(row.id, row.isVisible)}
                    className={`relative inline-flex items-center h-6 rounded-full w-10 ${row.isVisible ? "bg-green-600" : "bg-gray-300"}`}
                >
                    <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${row.isVisible ? "translate-x-5" : "translate-x-1"
                            }`}
                    ></span>
                </button>
            ),
            sortable: true,
        },
        {
            name: t('ACTIONS'),
            cell: row => (
                <div className="flex justify-between items-center space-x-4">
                    <button
                        onClick={() => handleDownload(row.name, row.file, row.contentType)}
                        className="text-lg text-blue-500 hover:underline">
                        <FontAwesomeIcon icon={faFileDownload} style={{ color: '#276EEC' }} />
                    </button>
                    {!isEmployee && (
                        <button
                            onClick={() => onEditDocumentClick(row)}
                            className="text-lg hover:underline">
                            <FontAwesomeIcon icon={faEdit} style={{ color: '#276EEC' }} />
                        </button>
                    )}
                    {!isEmployee && (
                        <button
                            onClick={() => onDeleteCompanyDocumentClick(row)}
                            className="text-lg text-red-500 hover:underline">
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    )}
                </div>
            ),
            ignoreRowClick: true,
        },
    ].filter(Boolean);

    const handleDownload = (name, file, contentType) => {
        const fileURL = decodeFile(file, contentType);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(fileURL);
    };

    const decodeFile = (base64String, contentType) => {
        const binaryString = atob(base64String);
        const byteArray = Uint8Array.from(binaryString, char => char.charCodeAt(0));
        const blob = new Blob([byteArray], { type: contentType });
        return URL.createObjectURL(blob);
    };

    const documentVisibility = (id, isVisible) => {
        openModal(
            <ConfirmationModal
                title={isVisible ? t('HIDE_DOCUMENT') : t('SHOW_DOCUMENT')}
                onConfirm={() => handleDocumentVisibility(id)}
                onCancel={closeModal}
            />
        );
    };

    const handleDocumentVisibility = async (id) => {
        try {
            await companyDocumentsService.updateDocumentVisibility(id, signal);
            toast.success(t('VISIBILITY_CHANGED_SUCCESS'));
            fetchData();
            closeModal();
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }
    };

    const onAddDocumentClick = () => {
        openModal(
            <CompanyDocumentsAdd closeModal={closeModal} fetchData={fetchData} />
        );
    };

    const onEditDocumentClick = (companyDocument) => {
        openModal(
            <CompanyDocumentsEdit companyDocument={companyDocument} closeModal={closeModal} fetchData={fetchData} />
        );
    };

    const onDeleteCompanyDocumentClick = (companyDocument) => {
        openModal(<DeleteConfirmationModal entityName={companyDocument.name} id={companyDocument.id} onDelete={handleDelete} onCancel={closeModal} />);
    };

    const handleDelete = async (id) => {
        try {
            await companyDocumentsService.delete(id);
            fetchData();
            closeModal();
            toast.success(t('DOCUMENT_DELETED_SUCCESSFULLY'));
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }
    }

    return (
        <div className="flex-1 p-6 max-w-full bg-gray-100 h-screen">
            <div className='flex justify-between items-center'>
                <h1 className="h1">{t('COMPANY_DOCUMENTS')}</h1>

                {!isEmployee && (
                    <div className="flex justify-end mt-4 pt-14 pb-4">
                        <button
                            type='button'
                            onClick={onAddDocumentClick}
                            className="btn-common h-10"
                        >
                            {t('ADD_DOCUMENT')}
                        </button>
                    </div>
                )}

            </div>

            <div className="flex flex-col gap-4 xs:flex-row">
                <CompanyDocumentsSearch fetchData={fetchData} />
            </div>

            <BaseModal />

            <div className='pt-5'>
                <DataTable
                    columns={columns}
                    data={data || []}
                    pagination
                    paginationServer
                    paginationTotalRows={companyDocumentsSearchStore.totalItemCount}
                    paginationDefaultPage={companyDocumentsSearchStore.page}
                    onChangePage={(newPage) => {
                        companyDocumentsSearchStore.setPage(newPage);
                        setSearchParams(companyDocumentsSearchStore.queryParams);
                    }}
                    paginationPerPage={companyDocumentsSearchStore.pageSize}
                    onChangeRowsPerPage={
                        (newPageSize) => {
                            companyDocumentsSearchStore.setPageSize(newPageSize);
                            setSearchParams(companyDocumentsSearchStore.queryParams);
                        }
                    }
                    highlightOnHover
                    persistTableHead={true}
                    paginationComponentOptions={paginationComponentOptions}
                    noDataComponent={<NoDataMessage />}
                    sortServer={true}
                />
            </div>
        </div>
    );
});