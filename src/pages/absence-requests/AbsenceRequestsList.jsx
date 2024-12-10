import React, { useState, useEffect, useCallback } from "react";
import DataTable from "react-data-table-component";
import { absenceRequestsService } from "../../services"
import { absenceRequestsSearchStore } from "./stores"
import { AbsenceRequestsAdd, AbsenceRequestsEdit } from "../absence-requests";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useModal } from "../../context";
import { BaseModal, DeleteConfirmationModal } from "../../components/modal";
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";
import { observer } from "mobx-react";
import { reaction } from "mobx"
import { PaginationOptions, NoDataMessage } from "../../components/common-ui";
import { format } from 'date-fns';
import { AbsenceRequestsSearch } from "./search";
import { useRequestAbort } from "../../components/hooks";
import "./AbsenceRequestsList.css";

export const AbsenceRequestsList = observer(() => {
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { openModal, closeModal } = useModal();
    const { signal } = useRequestAbort();

    const fetchData = useCallback(async () => {
        try {
            const response = await absenceRequestsService.getPagedList(
                absenceRequestsSearchStore.absenceRequestsFilter, signal);
            setData(response.data.items);
            absenceRequestsSearchStore.setTotalItemCount(response.data.totalItemCount);
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        } finally {
            setLoading(false);
        }

    }, [signal, t]);

    useEffect(() => {
        const disposer = reaction(
            () => [
                absenceRequestsSearchStore.absenceRequestsFilter
            ],
            () => {
                fetchData();
            }, {
            fireImmediately: true
        }
        );
        return () => disposer();
    }, [fetchData]);

    const handleDelete = async (absenceRequestId) => {
        try {
            await absenceRequestsService.delete(absenceRequestId);
            fetchData();
            closeModal();
            toast.success(t('DELETED'));
        } catch (error) {
            toast.error(t('FAILED_TO_DELETE'));
        }
    };

    const addNewRequestClick = () => {
        openModal(<AbsenceRequestsAdd closeModal={closeModal} fetchData={fetchData} />);
    }

    const editRequestClick = (absenceRequest) => {
        openModal(<AbsenceRequestsEdit absenceRequest={absenceRequest} closeModal={closeModal} fetchData={fetchData} />);
    };

    const deleteRequestClick = (absenceRequest) => {
        openModal(<DeleteConfirmationModal onDelete={() => handleDelete(absenceRequest.id)} onCancel={closeModal} />);
    };

    const handlePageChange = (newPage) => {
        absenceRequestsSearchStore.setPage(newPage);
    };

    const handleRowsPerPageChange = (newPageSize) => {
        absenceRequestsSearchStore.setPageSize(newPageSize);
        absenceRequestsSearchStore.setPage(1);
    };

    const columns = [
        {
            name: t('USERS'),
            selector: (row) => `${row.user?.firstName || ''} ${row.user?.lastName || ''}`.trim(),
            sortable: true,
        },
        {
            name: t('DATE_FROM'),
            selector: (row) => row.dateFrom ? format(new Date(row.dateFrom), t('DATE_FORMAT')) : '',
            sortable: true,
        },
        {
            name: t('DATE_TO'),
            selector: (row) => row.dateTo ? format(new Date(row.dateTo), t('DATE_FORMAT')) : '',
            sortable: true,
        },
        {
            name: t('DATE_RETURN'),
            selector: (row) => row.dateReturn ? format(new Date(row.dateReturn), t('DATE_FORMAT')) : '',
            sortable: true,
        },
        {
            name: t('STATUS'),
            selector: (row) => {
                switch (row.absenceRequestStatus) {
                    case 'Approved':
                        return t('APPROVED');
                    case 'Rejected':
                        return t('REJECTED'); 
                    default:
                        return t('PENDING');
                }
            },
            sortable: true,
        },
        {
            name: t('TYPE'),
            selector: (row) => row.absenceRequestType?.name,
            sortable: true,
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
        <div className="flex-1 p-6 max-w-full bg-gray-100 h-screen">
            <h1 className="h1">{t('ABSENCE_REQUESTS')}</h1>
            <div className="flex flex-col gap-4 max-w-full md:flex-row">
                <AbsenceRequestsSearch />
                <button
                    type="button"
                    className=" btn-common h-10 md:ml-auto"
                    onClick={addNewRequestClick}
                >
                    {t('NEW_REQUEST')}
                </button>
            </div>
            <BaseModal />

            <div className="table max-w-full">
                <DataTable
                    columns={columns}
                    data={data || []}
                    highlightOnHover
                    pagination
                    paginationServer
                    paginationTotalRows={absenceRequestsSearchStore.totalItemCount}
                    paginationDefaultPage={absenceRequestsSearchStore.pageNumber}
                    paginationPerPage={absenceRequestsSearchStore.pageSize}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    progressPending={loading}
                    persistTableHead={true}
                    noDataComponent={<NoDataMessage />}
                    paginationComponentOptions={PaginationOptions()}
                />
            </div>
        </div >
    );
});
