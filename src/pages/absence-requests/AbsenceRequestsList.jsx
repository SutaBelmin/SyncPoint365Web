import React, { useState, useEffect, useCallback, useMemo } from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";
import { observer } from "mobx-react";
import { reaction } from "mobx"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faEdit } from "@fortawesome/free-solid-svg-icons";
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
import debounce from "lodash.debounce";
import { useModal } from "../../context";
import { AbsenceRequestsStatusChange } from "../absence-requests";

export const AbsenceRequestsList = observer(() => {
    const { t } = useTranslation();
    const { openModal, closeModal } = useModal();
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
                        onClick={() => changeStatus(row)}
                    >
                        {
                            row.absenceRequestStatus === absenceRequestStatusConstant.pending ? (
                                <FontAwesomeIcon icon={faEdit} className="text-blue-600 hover:underline p-2" />
                            ) : (
                                <FontAwesomeIcon icon={faCircleCheck} className="text-green-700 hover:underline p-2" />
                            )
                        }
                    </button>
                </div>
            ),
        }
    ];

    const changeStatus = (absenceRequest) => {
        if (absenceRequest.absenceRequestStatus !== absenceRequestStatusConstant.pending) {
            openModal(<AbsenceRequestsStatusChange
                absenceRequest={absenceRequest}
                closeModal={closeModal}
                fetchData={fetchData}
                isStatusLocked={true}
            />);
        } else {
            openModal(<AbsenceRequestsStatusChange
                absenceRequest={absenceRequest}
                closeModal={closeModal}
                fetchData={fetchData}
            />);
        }
    };

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
            <h1 className="h1">{t('ABSENCE_REQUESTS')}</h1>
            <div className="flex flex-col gap-4 xs:flex-row">
                <AbsenceRequestsSearch fetchData={fetchData} />
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
                />
            </div>
        </div >
    );
});
