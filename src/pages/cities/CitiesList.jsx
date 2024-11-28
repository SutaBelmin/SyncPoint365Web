import React, { useCallback, useEffect, useState } from "react";
import { citiesService } from "../../services";
import DataTable from "react-data-table-component";
import { BaseModal, DeleteConfirmationModal } from "../../components/modal";
import { useModal } from "../../context/ModalProvider";
import { CitiesAdd, CitiesEdit } from "../cities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { CitiesSearch } from "./search/CitiesSearch";
import { observer } from "mobx-react";
import citiesSearchStore from './stores/CitiesSearchStore';
import { reaction } from "mobx";
import { useTranslation } from 'react-i18next';
import { NoDataMessage } from "../../components/common-ui";
import { PaginationOptions } from "../../components/common-ui/PaginationOptions";
import { useRequestAbort } from "../../components/hooks/useRequestAbort";


export const CitiesList = observer(() => {
    const [data, setData] = useState([]);
    const { openModal, closeModal } = useModal();
    const { t } = useTranslation();
    const paginationComponentOptions = PaginationOptions();
    const { signal } = useRequestAbort();

    const fetchData = useCallback(async () => {
        try {
            const filter = { ...citiesSearchStore.cityFilter };

            const response = await citiesService.getPagedCities(filter, signal);

            setData(response.data.items);
            citiesSearchStore.setTotalItemCount(response.data.totalItemCount);
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }
    }, [signal, t]);

    useEffect(() => {
        const disposeReaction = reaction(
            () => ({
                filter: citiesSearchStore.cityFilter
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
            name: t('NAME'),
            selector: row => row.name,
            sortable: true,
        },
        {
            name: t('DISPLAY_NAME'),
            selector: row => row.displayName,
            sortable: true,
        },
        {
            name: t('COUNTRY_NAME'),
            selector: row => row.country?.name,
            sortable: true,
        },
        {
            name: t('POSTAL_CODE'),
            selector: row => row.postalCode,
            sortable: true,
        },
        {
            name: t('ACTIONS'),
            cell: row => (
                <div className="flex">
                    <button
                        onClick={() => onEditCityClick(row)}
                        className="text-blue-500 hover:underline p-2">
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                        onClick={() => onDeleteCityClick(row)}
                        className="text-red-500 hover:underline p-2">
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            button: 'true',
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
            await citiesService.delete(cityId);
            fetchData();
            closeModal();
            toast.success(t('DELETED'));
        } catch (error) {
            toast.error(t('FAILED_TO_DELETE'));
        }
    }

    return (
        <div className="flex-1 p-6 bg-gray-100 h-screen">
            <h1 className="h1">{t('CITIES')}</h1>
            <div className="flex flex-col gap-4 md:flex-row">
                <CitiesSearch />
                <button
                    type="button"
                    onClick={onAddCitiesClick}
                    className="btn-common h-10 md:ml-auto"
                >
                    {t('ADD_CITY')}
                </button>
            </div>

            <div className="table max-w-full">
                <DataTable
                    columns={columns}
                    data={data || []}
                    pagination
                    paginationServer
                    paginationTotalRows={citiesSearchStore.totalItemCount}
                    onChangePage={(newPage) => {
                        citiesSearchStore.setPage(newPage);
                    }}
                    paginationPerPage={citiesSearchStore.pageSize}
                    onChangeRowsPerPage={
                        (newPageSize) => {
                            citiesSearchStore.setPageSize(newPageSize);
                            citiesSearchStore.setPage(1);
                        }
                    }
                    highlightOnHover
                    persistTableHead={true}
                    paginationComponentOptions={paginationComponentOptions}
                    noDataComponent={<NoDataMessage />} />
            </div>
        </div>
    );
}
);