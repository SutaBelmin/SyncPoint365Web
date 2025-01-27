import React, { useState, useEffect, useCallback, useMemo } from "react";
import { companyNewsSearchStore } from "./stores";
import { companyNewsService } from "../../services";
import { useRequestAbort } from "../../components/hooks";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import { BaseModal, DeleteConfirmationModal } from "../../components/modal";
import { NoDataMessage } from "../../components/common-ui";
import { PaginationOptions } from "../../utils";
import { observer } from "mobx-react-lite";
import debounce from "lodash.debounce";
import { reaction } from "mobx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faEyeSlash, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";
import { useModal } from "../../context/ModalProvider";
import { CompanyNewsAdd } from "./CompanyNewsAdd";
import { CompanyNewsEdit } from "./CompanyNewsEdit";
import { useAuth } from "../../context/AuthProvider";
import { CompanyNewsSearch } from "../company-news/search";

export const CompanyNewsList = observer(() => {
    const { signal } = useRequestAbort();
    const [, setSearchParams] = useSearchParams();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const { openModal, closeModal } = useModal();

    const [data, setData] = useState([]);
    const {loggedUser} = useAuth();

    const fetchData = useCallback(async () => {
        try {
            const filter = { ...companyNewsSearchStore.companyNewsFilter, userId: loggedUser.id };
            const response = await companyNewsService.getPagedList(filter, signal);

            setData(response.items);
            companyNewsSearchStore.setTotalItemCount(response.totalItemCount);
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
                    onClick={() => onEditCompanyNewsClick(row)}
                    className="text-lg text-blue-500 hover:underline p-2">
                    <FontAwesomeIcon icon={faEdit} style={{color: '#276EEC'}}/>
                    </button>
                    <button
                    onClick={()=>deleteRequestClick(row)}
                    className="text-lg text-red-500 hover:underline p-2">
                    <FontAwesomeIcon icon={faTrash}/>
                    </button>
                    <button
                    onClick={()=>handleVisibilityChange(row.id
                        
                    )}
                    >
                     {row.isVisible ? (
                        <FontAwesomeIcon icon={faEye} style={{color: '#276EEC'}}/>
                     ) : (
                        <FontAwesomeIcon icon={faEyeSlash} style={{color: '#276EEC'}}/>
                     )}
                    </button>
                </div>
            ),
        }
    ];

    const onAddCompanyNewsClick = () => {
        openModal(<CompanyNewsAdd closeModal={closeModal} fetchData={fetchData}/>)
    }

    const onEditCompanyNewsClick = (companyNews) => {
        openModal(<CompanyNewsEdit companyNews={companyNews} closeModal={closeModal} fetchData={fetchData}/>)
    }

    const deleteRequestClick = (companyNews) => {
        openModal(<DeleteConfirmationModal entityName={companyNews.name} onDelete={()=> handleDelete(companyNews.id)} onCancel={closeModal}/>)
    }

    const handleDelete = async (companyNewsId) => {
        try {
            await companyNewsService.delete(companyNewsId, signal);
            fetchData();
            closeModal();
            toast.success(t('DELETED'));
        } catch (error) {
            toast.error(t('FAILED_TO_DELETE'));
        }
    }

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
            setSearchParams(companyNewsSearchStore.queryParams);
        }
    };

    const handleVisibilityChange = async (id) => {
        try {   
            await companyNewsService.updateVisibility(id);
            fetchData();
            toast.success(t('STATUS_CHANGED'));
        } catch (error) {
            toast.error(t('FAIL_UPDATE'));
        }
    };

    return (
        <div className="flex-1 p-6 max-w-full bg-gray-100 h-screen">
            <div className="flex flex-col xs:flex-row justify-between">
                <h1 className="h1">{t('COMPANY_NEWS')}</h1>

                <div className="flex justify-end mt-4 pb-4 pt-14 md:pt-14 sm:pt-14 xs:pt-14 ss:pt-0">
                    <button
                        type="button"
                        onClick={onAddCompanyNewsClick}
                        className="btn-common h-10 md:max-w-[9rem] sm:max-w-[9rem] xs:max-w-full ss:max-w-full md:ml-auto"
                    >
                        {t('ADD_NEW_ARTICLE')}
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-4 xs:flex-row">
                <CompanyNewsSearch fetchData={fetchData}/>
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