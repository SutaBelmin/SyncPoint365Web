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
import { NoDataMessage } from "../../components/common-ui";
import { PaginationOptions } from "../../components/common-ui";
import { format } from 'date-fns';
//import AbsenceRequestsSearch from "./search";

import "./AbsenceRequestsList.css";

export const AbsenceRequestsList = () => {
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [absenceRequestTypeId] = useState(null);
    const [userId] = useState(null);
    const [dateFrom] = useState(null);
    const [dateTo] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItemCount, setTotalItemCount] = useState(0);
    const { openModal, closeModal } = useModal();

    const fetchData = useCallback(async () => {
        try {
            const response = await absenceRequestsService.getPagedList(
                absenceRequestTypeId, userId, dateFrom, dateTo, page, pageSize);
            setData(response.data.items);
            setTotalItemCount(response.data.totalItemCount);
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        } finally {
            setLoading(false);
        }
    }, [absenceRequestTypeId, userId, dateFrom, dateTo, page, pageSize, t]); 

    useEffect(() => {
        fetchData();
    }, [fetchData]); 

    const handleDelete = async (absenceRequestId) => {
        try {
            await absenceRequestsService.delete(absenceRequestId);
            fetchData();
            closeModal();
        } catch (error) {
            toast.error("Failed to delete the record. Please try again.");
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
        setPage(newPage);
    };

    const handleRowsPerPageChange = (newPageSize) => {
        setPageSize(newPageSize);
        setPage(1);
    };

    const columns = [
        {
            name: "User",
            selector: (row) => `${row.user?.firstName || ''} ${row.user?.lastName || ''}`.trim(),
            sortable: true,
        },
        {
            name: "Date from",
            selector: (row) => row.dateFrom ? format(new Date(row.dateFrom), 'dd.MM.yyyy HH:mm') : '',
            sortable: true,
        },
        {
            name: "Date to",
            selector: (row) => row.dateTo ? format(new Date(row.dateTo), 'dd.MM.yyyy HH:mm') : '',
            sortable: true,
        },
        {
            name: "Date return",
            selector: (row) => row.dateReturn ? format(new Date(row.dateReturn), 'dd.MM.yyyy HH:mm') : '',
            sortable: true,
        },
        {
            name: "Status",
            selector: (row) => row.absenceRequestStatus,
            sortable: true,
        },
        {
            name: "Type ",
            selector: (row) => row.absenceRequestType?.name,
            sortable: true,
        },
        {
            name: "Comment",
            selector: (row) => row.comment,
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
            <div className="flex flex-col gap-4 md:flex-row">
                <button
                    type="button"
                    className=" btn-common h-10  md:ml-auto"
                    onClick={addNewRequestClick}
                >
                    {t('NEW_REQUEST_TYPE')}
                </button>
            </div>
            <BaseModal />
            <div className="table max-w-full">
                <DataTable
                    columns={columns}
                    data={data}
                    highlightOnHover
                    pagination
                    paginationServer
                    paginationTotalRows={totalItemCount}
                    paginationDefaultPage={page}
                    paginationPerPage={pageSize}
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
};
