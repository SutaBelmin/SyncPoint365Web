import React, { useState, useEffect, useCallback, useMemo } from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";
import { observer } from "mobx-react";
import { reaction } from "mobx"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRequestAbort } from "../../components/hooks";
import { BaseModal, DeleteConfirmationModal } from "../../components/modal";
import { NoDataMessage } from "../../components/common-ui";
import { format } from 'date-fns';
import { AbsenceRequestsSearchEmployeeView } from "./search";
import { AbsenceRequestsAddEmployeeView, AbsenceRequestsEditEmployeeView, AbsenceRequestsStatusChange } from "../absence-requests";
import { absenceRequestsService } from "../../services"
import { absenceRequestsSearchStore } from "./stores"
import "./AbsenceRequestsList.css";
import { absenceRequestStatusConstant } from "../../constants";
import { useSearchParams } from "react-router-dom";
import { useModal } from "../../context";
import debounce from "lodash.debounce";
import { useAuth } from "../../context/AuthProvider";
import { PaginationOptions } from "../../utils";

export const AbsenceRequestsListEmployeeView = observer(() => {
    const { t } = useTranslation();
    const { openModal, closeModal } = useModal();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { signal } = useRequestAbort();
    const [, setSearchParams] = useSearchParams();
    const { loggedUser } = useAuth();

    const fetchData = useCallback(async () => {
        try {
            const filter = { ...absenceRequestsSearchStore.absenceRequestFilter, userId: loggedUser.id };

            const response = await absenceRequestsService.getPagedList(filter, signal);

            setData(response.data.items);
            absenceRequestsSearchStore.setTotalItemCount(response.data.totalItemCount);
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        } finally {
            setLoading(false);
        }
    }, [signal, loggedUser, t]);

    const debouncedFetchData = useMemo(() => debounce(fetchData, 100), [fetchData]);

    useEffect(() => {
        const disposeReaction = reaction(
            () => ({
                page: absenceRequestsSearchStore.page,
                pageSize: absenceRequestsSearchStore.pageSize,
                orderBy: absenceRequestsSearchStore.orderBy,
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
                    {row.absenceRequestStatus === absenceRequestStatusConstant.pending ? (
                        <>
                            <button
                                onClick={() => editRequestClick(row)}
                                className="text-lg text-blue-500 hover:underline p-2">
                                <FontAwesomeIcon icon={faEdit} style={{ color: '#276EEC' }} />
                            </button>
                            <button
                                onClick={() => deleteRequestClick(row)}
                                className="text-lg text-red-500 hover:underline p-2">
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => changeStatus(row)}
                            className="text-lg text-green-700 hover:underline p-2">
                            <FontAwesomeIcon icon={faCircleCheck} />
                        </button>
                    )}
                </div>
            )
        }
    ];

    const addNewRequestClick = () => {
        openModal(<AbsenceRequestsAddEmployeeView userId={loggedUser.id} closeModal={closeModal} fetchData={fetchData} />);
    }

    const editRequestClick = (absenceRequest) => {
        openModal(<AbsenceRequestsEditEmployeeView absenceRequest={absenceRequest} closeModal={closeModal} fetchData={fetchData} />);
    };

    const changeStatus = (absenceRequest) => {
        openModal(<AbsenceRequestsStatusChange
            absenceRequest={absenceRequest}
            closeModal={closeModal}
            fetchData={fetchData}
            isStatusLocked={true}
        />);
    };

    const deleteRequestClick = (absenceRequest) => {
        openModal(<DeleteConfirmationModal onDelete={() => deleteAbsenceRequest(absenceRequest.id)} onCancel={closeModal} />);
    };

    const deleteAbsenceRequest = async (absenceRequestId) => {
        try {
            await absenceRequestsService.delete(absenceRequestId);
            fetchData();
            closeModal();
            toast.success(t('DELETED'));
        } catch (error) {
            toast.error(t('FAILED_TO_DELETE'));
        }
    }

    const handlePageChange = (newPage) => {
        absenceRequestsSearchStore.setPage(newPage);
        setSearchParams(absenceRequestsSearchStore.queryParams);
    }

    const handleRowsPerPageChange = (newPageSize) => {
        absenceRequestsSearchStore.setPageSize(newPageSize);
        setSearchParams(absenceRequestsSearchStore.queryParams);
    };

    const sortAbsenceRequest = async (column, direction) => {
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
            <div className="flex flex-col xs:flex-row justify-between">
                <h1 className="h1">{t('ABSENCE_REQUESTS')}</h1>

                <div className="flex justify-end mt-4 pb-4 pt-14 md:pt-14 sm:pt-14 xs:pt-14 ss:pt-0">
                    <button
                        type="button"
                        className="btn-common h-10 md:max-w-[9rem] sm:max-w-[9rem] xs:max-w-full ss:max-w-full md:ml-auto"
                        onClick={addNewRequestClick}
                    >
                        {t('ADD_NEW_REQUEST')}
                    </button>

                </div>
            </div>
            <div className="flex flex-col gap-4 xs:flex-row">
                <AbsenceRequestsSearchEmployeeView fetchData={fetchData} />
            </div>
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
                    onSort={sortAbsenceRequest}
                    onRowClicked={(row) => {
                        if (row.absenceRequestStatus !== absenceRequestStatusConstant.pending) {
                            changeStatus(row);
                        }
                    }}
                />
            </div>
        </div >
    );
});
