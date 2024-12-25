import React, { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";
import { observer } from "mobx-react";
import { reaction } from "mobx"
import { useModal } from "../../context";
import { BaseModal, DeleteConfirmationModal } from "../../components/modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { NoDataMessage } from "../../components/common-ui";
import { PaginationOptions } from "../../components/common-ui";
import { useRequestAbort } from "../../components/hooks";
import AbsenceRequestTypesSearch from "./search";
import { AbsenceRequestTypesAdd, AbsenceRequestTypesEdit } from "../absence-request-types";
import { absenceRequestTypesSearchStore } from "./stores";
import { absenceRequestTypesService } from "../../services";
import { useSearchParams } from "react-router-dom";
import debounce from "lodash.debounce";


export const AbsenceRequestTypesList = observer(() => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { openModal, closeModal } = useModal();
    const { t } = useTranslation();
    const { signal } = useRequestAbort();
    const [, setSearchParams] = useSearchParams();

    const fetchData = useCallback(async () => {
        try {
            const filter = { ...absenceRequestTypesSearchStore.absenceRequestFilter };
            const response = await absenceRequestTypesService.getPagedList(filter, signal);
            setData(response.items);
            absenceRequestTypesSearchStore.setTotalItemCount(response.totalItemCount);
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'))
        } finally {
            setLoading(false);
        }
    }, [signal, t]);

    const debouncedFetchData = useMemo(() => debounce(fetchData, 100), [fetchData]);

    useEffect(() => {
        const disposeReaction = reaction(
            () => ({
                page: absenceRequestTypesSearchStore.page,
                pageSize: absenceRequestTypesSearchStore.pageSize,
                orderBy: absenceRequestTypesSearchStore.orderBy,
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
            name: t('NAME'),
            selector: (row) => row.name,
            sortable: true,
            sortField: 'Name',
        },
        {
            name: t('ACTIVE'),
            selector: (row) => row.isActive ? t('YES') : t('NO'),
        },
        {
            name: t('ACTIONS'),
            cell: (row) => (
                <div className="flex">
                    <button
                        onClick={() => editRequestClick(row)}
                        className="text-lg text-blue-500 hover:underline p-2">
                        <FontAwesomeIcon icon={faEdit} style={{ color: '#276EEC' }} />
                    </button>
                    <button
                        onClick={() => deleteRequestClick(row)}
                        className="text-md text-red-500 hover:underline p-2">
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            ),
        },
    ];

    const addNewRequestClick = () => {
        openModal(<AbsenceRequestTypesAdd closeModal={closeModal} fetchData={fetchData} />);
    }

    const editRequestClick = (absenceRequestType) => {
        openModal(<AbsenceRequestTypesEdit absenceRequestType={absenceRequestType} closeModal={closeModal} fetchData={fetchData} />);
    }

    const deleteRequestClick = (absenceRequestType) => {
        openModal(<DeleteConfirmationModal entityName={absenceRequestType.name} onDelete={() => handleDelete(absenceRequestType.id)} onCancel={closeModal} />);
    }

    const handleDelete = async (absenceRequestTypeId) => {
        try {
            await absenceRequestTypesService.delete(absenceRequestTypeId, signal);
            fetchData();
            closeModal();
            toast.success(t('DELETED'));
        } catch (error) {
            toast.error(t('FAILED_TO_DELETE'));
        }
    }

    const handlePageChange = (newPage) => {
        absenceRequestTypesSearchStore.setPage(newPage);
        setSearchParams(absenceRequestTypesSearchStore.queryParams);
    }

    const handleRowsPerPageChange = (newPageSize) => {
        absenceRequestTypesSearchStore.setPageSize(newPageSize);
        setSearchParams(absenceRequestTypesSearchStore.queryParams);
    };

    const handleSort = (column, direction) => {
        const field = column.sortField;
        if (field) {
            const orderBy = `${field}|${direction}`;
            absenceRequestTypesSearchStore.setOrderBy(orderBy);
        }
        setSearchParams(absenceRequestTypesSearchStore.queryParams);
    };

    return (
        <div className="flex-1 p-6 max-w-full bg-gray-100 h-screen">
            <h1 className="h1">{t('ABSENCE_REQUEST_TYPES')}</h1>
            <div className="flex flex-col gap-4 md:flex-row">
                <AbsenceRequestTypesSearch fetchData={fetchData} />
                <button
                    type="button"
                    onClick={addNewRequestClick}
                    className=" btn-common h-10  md:ml-auto"
                >
                    {t('NEW_REQUEST_TYPE')}
                </button>
            </div>
            <BaseModal />
            <div className="table max-w-full">
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    paginationServer
                    paginationTotalRows={absenceRequestTypesSearchStore.totalItemCount}
                    paginationDefaultPage={absenceRequestTypesSearchStore.page}
                    paginationPerPage={absenceRequestTypesSearchStore.rowsPerPage}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    highlightOnHover
                    progressPending={loading}
                    persistTableHead={true}
                    noDataComponent={<NoDataMessage />}
                    paginationComponentOptions={PaginationOptions()}
                    onSort={handleSort}
                    sortServer={true}
                />
            </div>
        </div>
    );
});