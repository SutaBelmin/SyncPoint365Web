import React, { useState, useEffect, useCallback } from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";
import { observer } from "mobx-react";
import { reaction } from "mobx"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRequestAbort } from "../../components/hooks";
import { BaseModal } from "../../components/modal";
import { PaginationOptions, NoDataMessage } from "../../components/common-ui";
import { format } from 'date-fns';
import { AbsenceRequestsSearch } from "./search";
import { absenceRequestsService } from "../../services"
import { absenceRequestsSearchStore } from "./stores"
import "./AbsenceRequestsList.css";
import { absenceRequestStatusConstant } from "../../constants";
import { useSearchParams } from "react-router-dom";

export const AbsenceRequestsList = observer(() => {
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { signal } = useRequestAbort();
    const [, setSearchParams] = useSearchParams();

    const fetchData = useCallback(async () => {
        try {
            const filter = { ...absenceRequestsSearchStore.absenceRequestFilter };

            const response = await absenceRequestsService.getPagedList(filter, signal);

            setData(response.data.items);
            absenceRequestsSearchStore.setTotalItemCount(response.data.totalItemCount);

        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        } finally {
            setLoading(false);
        }

    }, [signal, t]);

    useEffect(() => {
        const disposeReaction = reaction(
            () => ({
                page: absenceRequestsSearchStore.page,
                pageSize: absenceRequestsSearchStore.pageSize,
                orderBy: absenceRequestsSearchStore.orderBy,
            }),
            
            () => {
                fetchData();

            },
            {
                fireImmediately: true
            }
        );

        return () => disposeReaction();
    }, [fetchData]);

    const columns = [
        {
            name: t('USER'),
            selector: (row) => `${row.user?.firstName || ''} ${row.user?.lastName || ''}`.trim(),
            sortable: true,
            sortField: 'user.lastName',
        },
        {
            name: t('DATE_FROM'),
            selector: (row) => row.dateFrom ? format(new Date(row.dateFrom), t('DATE_FORMAT')) : '',
            sortable: true,
            sortField: 'dateFrom',
        },
        {
            name: t('DATE_TO'),
            selector: (row) => row.dateTo ? format(new Date(row.dateTo), t('DATE_FORMAT')) : '',
            sortable: true,
            sortField: 'dateTo'
        },
        {
            name: t('DATE_RETURN'),
            selector: (row) => row.dateReturn ? format(new Date(row.dateReturn), t('DATE_FORMAT')) : '',
        },
        {
            name: t('STATUS'),
            selector: row => {
                switch (row.absenceRequestStatus) {
                    case absenceRequestStatusConstant.approved:
                        return t('APPROVED');
                    case absenceRequestStatusConstant.rejected:
                        return t('REJECTED');
                    default:
                        return t('PENDING');
                }
            },
        },
        {
            name: t('TYPE'),
            selector: (row) => row.absenceRequestType?.name,
        },
        {
            name: t('ACTIONS'),
            cell: row => (
                <div className="flex">
                    <button
                        //onClick={() => editRequestClick(row)}
                        className="text-blue-500 hover:underline p-2">
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                        //onClick={() => deleteRequestClick(row)}
                        className="text-red-500 hover:underline p-2">
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            ),
        }
    ];

    // const addNewRequestClick = () => {
    //     openModal(<AbsenceRequestsAdd closeModal={closeModal} fetchData={fetchData} />);
    // }

    // const editRequestClick = (absenceRequest) => {
    //     openModal(<AbsenceRequestsEdit absenceRequest={absenceRequest} closeModal={closeModal} fetchData={fetchData} />);
    // };

    // const deleteRequestClick = (absenceRequest) => {
    //     openModal(<DeleteConfirmationModal onDelete={() => handleDelete(absenceRequest.id)} onCancel={closeModal} />);
    // };

    // const handleDelete = async (absenceRequestId) => {
    //     try {
    //         await absenceRequestsService.delete(absenceRequestId);
    //         fetchData();
    //         closeModal();
    //         toast.success(t('DELETED'));
    //     } catch (error) {
    //         toast.error(t('FAILED_TO_DELETE'));
    //     }
    // }

    const handlePageChange = (newPage) => {
        absenceRequestsSearchStore.setPage(newPage);
        setSearchParams(absenceRequestsSearchStore.queryParams);
    }

    const handleRowsPerPageChange = (newPageSize) => {
        absenceRequestsSearchStore.setPageSize(newPageSize);
        setSearchParams(absenceRequestsSearchStore.queryParams);
    };

    const handleSort = async (column, direction) => {
        const field = column.sortField || null; 
        let orderBy = null;
    
        if (field) {
            if (field === "user.lastName") {
                orderBy = `${field}|${direction}, user.firstName|${direction}`;
            } else {
                orderBy = `${field}|${direction}`;
            }
            absenceRequestsSearchStore.setOrderBy(orderBy);
        } else {
            absenceRequestsSearchStore.setOrderBy(null);
        }
    
        setSearchParams(absenceRequestsSearchStore.queryParams);
    };
    

    return (
        <div className="flex-1 p-6 max-w-full bg-gray-100 h-screen">
            <h1 className="h1">{t('ABSENCE_REQUESTS')}</h1>
            <div className="flex flex-col gap-4 xs:flex-row">
                <AbsenceRequestsSearch fetchData={fetchData} />
            </div>

            {/* <div className="flex justify-end mt-4">
                    <button
                        type="button"
                        className="btn-common h-10 ml-auto"
                        onClick={addNewRequestClick}
                    >
                        {t('NEW_REQUEST')}
                    </button>
                    </div> */}
            <BaseModal />

            <div className="table max-w-full">
                <DataTable
                    columns={columns}
                    data={data}
                    sortServer={true}
                    pagination
                    paginationServer
                    paginationTotalRows={absenceRequestsSearchStore.totalItemCount}
                    paginationDefaultPage={absenceRequestsSearchStore.page}
                    onChangePage={handlePageChange}
                    paginationPerPage={absenceRequestsSearchStore.pageSize}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    highlightOnHover
                    progressPending={loading}
                    persistTableHead={true}
                    paginationComponentOptions={PaginationOptions()}
                    noDataComponent={<NoDataMessage />}
                    onSort={handleSort}
                />
            </div>
        </div >
    );
});
