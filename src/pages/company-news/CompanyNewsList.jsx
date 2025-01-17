import React, { useState, useEffect, useCallback, useMemo } from "react";
import { companyNewsSearchStore } from "./stores";
import { companyNewsService } from "../../services";
import { useRequestAbort } from "../../components/hooks";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import { BaseModal } from "../../components/modal";
import { NoDataMessage } from "../../components/common-ui";
import { PaginationOptions } from "../../utils";
import { observer } from "mobx-react-lite";
import debounce from "lodash.debounce";
import { reaction } from "mobx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";


export const CompanyNewsList = observer(() => {
    const { signal } = useRequestAbort();
    const [, setSearchParams] = useSearchParams();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);

    const [data, setData] = useState([]);


    const fetchData = useCallback(async () => {
        try {
            const filter = { ...companyNewsSearchStore.companyNewsFilter };
            const response = await companyNewsService.getPagedList(filter, signal);

            setData(response.items);
            companyNewsSearchStore.setTotalItemCount(response.totalItemCount);
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
                page: companyNewsSearchStore.page,
                pageSize: companyNewsSearchStore.pageSize,
                orderBy: companyNewsSearchStore.orderBy,
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
            name: t('AUTHOR'),
            selector: (row) => `${row.user?.firstName || ''} ${row.user?.lastName || ''}`.trim(),
            sortable: true,
            sortField: 'user.lastName',
        },
        {
            name: t('ARTICLE_TITLE'),
            selector: (row) => row.title,
        },
        {
            name: t('STATUS'),
            selector: (row) => row.isVisible ? t('PUBLISHED') : t('HIDDEN'),
        },
        {
            name: t('ACTIONS'),
            cell: row => (
                <div className="flex">
                    <button
                    //onClick={() => changeStatus(row)}
                    >
                        {
                            //row.absenceRequestStatus === absenceRequestStatusConstant.pending ? (
                            <FontAwesomeIcon icon={faEdit} className="text-blue-600 hover:underline p-2" />
                            //) : (
                            //    <FontAwesomeIcon icon={faCircleCheck} className="text-green-700 hover:underline p-2" />
                            //)
                        }
                    </button>
                </div>
            ),
        }
    ];

    const handlePageChange = (newPage) => {
        companyNewsSearchStore.setPage(newPage);
        setSearchParams(companyNewsSearchStore.queryParams);
    }

    const handleRowsPerPageChange = (newPageSize) => {
        companyNewsSearchStore.setPageSize(newPageSize);
        setSearchParams(companyNewsSearchStore.queryParams);
    };

    const handleSort = (column, direction) => {
        const field = column.sortField;
        if (field) {
            const orderBy = `${field}|${direction}`;
            companyNewsSearchStore.setOrderBy(orderBy);
        }
        setSearchParams(companyNewsSearchStore.queryParams);
    };

    return (
        <div className="flex-1 p-6 max-w-full bg-gray-100 h-screen">
            <div className="flex flex-col xs:flex-row justify-between">
                <h1 className="h1">{t('COMPANY_NEWS')}</h1>

                <div className="flex justify-end mt-4 pb-4 pt-14 md:pt-14 sm:pt-14 xs:pt-14 ss:pt-0">
                    <button
                        type="button"
                        //onClick={addNewRequestClick}
                        className="btn-common h-10 md:max-w-[9rem] sm:max-w-[9rem] xs:max-w-full ss:max-w-full md:ml-auto"
                    >
                        {t('ADD_NEW_ARTICLE')}
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-4 xs:flex-row">
                {/* <AbsenceRequestTypesSearch fetchData={fetchData} /> */}
            </div>

            <div className="flex flex-col gap-4 md:flex-row">

            </div>



            <BaseModal />
            <div className="table max-w-full">
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    paginationServer
                    paginationTotalRows={companyNewsSearchStore.totalItemCount}
                    paginationDefaultPage={companyNewsSearchStore.page}
                    paginationPerPage={companyNewsSearchStore.rowsPerPage}
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
})