import React, { useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import absenceRequestTypesSearchStore from "./stores/AbsenceRequestTypesSearchStore";
import { absenceRequestTypesService } from "../../services";
import { AbsenceRequestTypesAdd, AbsenceRequestTypesEdit } from "../absence-request-types";
import { useModal } from "../../context";
import { BaseModal, DeleteConfirmationModal } from "../../components/modal";
import { toast } from "react-toastify";
import { observer } from "mobx-react";
import { reaction } from "mobx"
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import NoDataMessage from "../../components/common-ui/NoDataMessage";
import { PaginationOptions } from "../../components/common-ui/PaginationOptions";
import AbsenceRequestTypesSearch from "./search/AbsenceRequestTypesSearch";
import { useRequestAbort } from "../../components/hooks/useRequestAbort";

export const AbsenceRequestTypesList = observer(() => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { openModal, closeModal } = useModal();
    const { t } = useTranslation();
    const paginationComponentOptions = PaginationOptions();
    const { signal } = useRequestAbort();

    const fetchData = useCallback(async () => {
        try {
            const response = await absenceRequestTypesService.getPagedList(
                absenceRequestTypesSearchStore.absenceRequestFilter, signal
            );
            setData(response.items);
            absenceRequestTypesSearchStore.setTotalItemCount(response.totalItemCount);
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'))
        } finally {
            setLoading(false);
        }
    }, [t, signal]);

    const handleDelete = async (absenceRequestTypeId) => {
        try {
            await absenceRequestTypesService.delete(absenceRequestTypeId);
            fetchData();
            closeModal();
            toast.success(t('DELETED'));
        } catch (error) {
            toast.error(t('FAILED_TO_DELETE'));
        }
    }

    const addNewRequestClick = () => {
        openModal(<AbsenceRequestTypesAdd closeModal={closeModal} fetchData={fetchData} />);
    }

    const editRequestClick = (absenceRequestType) => {
        openModal(<AbsenceRequestTypesEdit absenceRequestType={absenceRequestType} closeModal={closeModal} fetchData={fetchData} />);
    }

    const deleteRequestClick = (absenceRequestType) => {
        openModal(<DeleteConfirmationModal entityName={absenceRequestType.name} onDelete={() => handleDelete(absenceRequestType.id)} onCancel={closeModal} />);
    }

    useEffect(() => {
        const disposer = reaction(
            () => [
                absenceRequestTypesSearchStore.absenceRequestFilter
            ],
            () => {
                fetchData();
            }, {
            fireImmediately: true
        }
        );
        return () => disposer();
    }, [fetchData]);

    const handlePageChange = (newPage) => {
        absenceRequestTypesSearchStore.setPageNumber(newPage);
    }

    const handleRowsPerPageChange = (newRowsPerPage) => {
        absenceRequestTypesSearchStore.setRowsPerPage(newRowsPerPage);
        absenceRequestTypesSearchStore.setPageNumber(1);
    };

    const columns = [
        {
            name: t('NAME'),
            selector: (row) => row.name,
            sortable: true
        },
        {
            name: t('ACTIVE'),
            selector: (row) => row.isActive ? t('YES') : t('NO'),
            sortable: true
        },
        {
            name: t('ACTIONS'),
            cell: (row) => (
                <div className="flex">
                    <button
                        type="button"
                        onClick={() => editRequestClick(row)}
                        className="text-blue-500 hover:underline p-2">
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                        type="button"
                        onClick={() => deleteRequestClick(row)}
                        className="text-red-500 hover:underline p-2">
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">{t('ABSENCE_REQUEST_TYPES')}</h1>
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4">
                    <AbsenceRequestTypesSearch />
                </div>
                <button
                    type="button"
                    onClick={addNewRequestClick}
                    className="btn-new"
                >
                    {t('NEW_REQUEST_TYPE')}
                </button>
            </div>
            <BaseModal />
            <DataTable
                columns={columns}
                data={data}
                highlightOnHover
                pagination
                paginationServer
                paginationTotalRows={absenceRequestTypesSearchStore.totalItemCount}
                paginationDefaultPage={absenceRequestTypesSearchStore.pageNumber}
                paginationPerPage={absenceRequestTypesSearchStore.rowsPerPage}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handleRowsPerPageChange}
                progressPending={loading}
                persistTableHead={true}
                noDataComponent={<NoDataMessage />}
                paginationComponentOptions={paginationComponentOptions}
            />
        </div>
    );
});