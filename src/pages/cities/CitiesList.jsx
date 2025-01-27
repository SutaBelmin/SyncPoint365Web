import React, { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import DataTable from "react-data-table-component";
import { useSearchParams } from "react-router-dom";
import { useModal } from "../../context/ModalProvider";
import { NoDataMessage } from "../../components/common-ui";
import { BaseModal, DeleteConfirmationModal } from "../../components/modal";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CitiesSearch } from "./search";
import { observer } from "mobx-react";
import { reaction } from "mobx";
import { citiesSearchStore } from './stores';
import { citiesService } from "../../services";
import { CitiesAdd, CitiesEdit } from "../cities";
import { useRequestAbort } from "../../components/hooks/useRequestAbort";
import debounce from "lodash.debounce";
import { PaginationOptions } from "../../utils";

export const CitiesList = observer(() => {
    const { t } = useTranslation();
    const { signal } = useRequestAbort();
    const [data, setData] = useState([]);
    const { openModal, closeModal } = useModal();
    const [, setSearchParams] = useSearchParams();

    const fetchData = useCallback(async () => {
        try {
            const filter = {
                ...citiesSearchStore.cityFilter
            };

            const response = await citiesService.getPagedCities(filter, signal);

            setData(response.data.items);
            citiesSearchStore.setTotalItemCount(response.data.totalItemCount);
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }
    }, [signal, t]);

    const debouncedFetchData = useMemo(() => debounce(fetchData, 100), [fetchData]);

    useEffect(() => {
        const disposeReaction = reaction(
            () => ({
                page: citiesSearchStore.page,
                pageSize: citiesSearchStore.pageSize,
                orderBy: citiesSearchStore.orderBy
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
            selector: row => row.name,
            sortable: true,
            sortField: 'name'
        },
        {
            name: t('DISPLAY_NAME'),
            selector: row => row.displayName,
            sortable: false,
        },
        {
            name: t('COUNTRY_NAME'),
            selector: row => row.country?.name,
            sortable: false,
        },
        {
            name: t('POSTAL_CODE'),
            selector: row => row.postalCode,
            sortable: false,
        },
        {
            name: t('ACTIONS'),
            cell: row => (
                <div className="flex">
                    <button
                        onClick={() => onEditCityClick(row)}
                        className="text-lg text-blue-500 hover:underline p-2">
                        <FontAwesomeIcon icon={faEdit} style={{ color: '#276EEC' }} />
                    </button>
                    <button
                        onClick={() => onDeleteCityClick(row)}
                        className="text-lg text-red-500 hover:underline p-2">
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
        }
    ];

    const onAddCitiesClick = () => {
        openModal(<CitiesAdd closeModal={closeModal} fetchData={fetchData} />);
    }

    const onEditCityClick = (city) => {
        openModal(<CitiesEdit city={city} closeModal={closeModal} fetchData={fetchData} />)
    }

    const onDeleteCityClick = (city) => {
        openModal(<DeleteConfirmationModal entityName={city.name} id={city.id} onDelete={handleDelete} onCancel={closeModal} />);
    }

    const handleDelete = async (cityId) => {
        try {
            await citiesService.delete(cityId, signal);
            fetchData();
            closeModal();
            toast.success(t('CITY_DELETED_SUCCESSFULLY'));
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }
    }

    return (
        <div className="flex-1 p-6 bg-gray-100 h-screen">
            <div className="flex justify-between items-center">
                <h1 className="h1"> {t("CITIES")}</h1>
                <div className="flex justify-end mt-4 pt-14 pb-4">
                    <button
                        type="button"
                        onClick={onAddCitiesClick}
                        className="btn-common h-10 md:ml-auto"
                    >
                        {t('ADD_CITY')}
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-4 md:flex-row">
                <CitiesSearch fetchData={fetchData} />
            </div>


            <BaseModal />
            <div className="table max-w-full">
                <DataTable
                    columns={columns}
                    data={data || []}
                    pagination
                    paginationServer
                    paginationTotalRows={citiesSearchStore.totalItemCount}
                    paginationDefaultPage={citiesSearchStore.page}
                    onChangePage={(newPage) => {
                        citiesSearchStore.setPage(newPage);
                        setSearchParams(citiesSearchStore.queryParams);
                    }}
                    paginationPerPage={citiesSearchStore.pageSize}
                    onChangeRowsPerPage={
                        (newPageSize) => {
                            citiesSearchStore.setPageSize(newPageSize);
                            setSearchParams(citiesSearchStore.queryParams);
                        }
                    }
                    highlightOnHover
                    persistTableHead={true}
                    paginationComponentOptions={PaginationOptions()}
                    noDataComponent={<NoDataMessage />}
                    onSort={(column, sortDirection) => {
                        const sortField = column.sortField;
                        if (sortField) {
                            const orderBy = `${sortField}|${sortDirection}`;
                            citiesSearchStore.setOrderBy(orderBy);
                            setSearchParams(citiesSearchStore.queryParams);
                        }
                    }}
                    sortServer={true}
                />
            </div>
        </div>
    );
});