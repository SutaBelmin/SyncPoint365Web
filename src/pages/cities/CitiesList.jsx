import { toast } from "react-toastify";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import {CitiesSearch} from "./search";
import { observer } from "mobx-react";
import { reaction } from "mobx";
import { useTranslation } from 'react-i18next';
import DataTable from "react-data-table-component";
import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { citiesSearchStore } from './stores';
import { citiesService } from "../../services";
import { CitiesAdd, CitiesEdit } from "../cities";
import { useModal } from "../../context/ModalProvider";
import { NoDataMessage } from "../../components/common-ui";
import { useRequestAbort } from "../../components/hooks/useRequestAbort";
import { BaseModal, DeleteConfirmationModal } from "../../components/modal";
import { PaginationOptions } from "../../components/common-ui/PaginationOptions";

export const CitiesList = observer(() => {
    const { t } = useTranslation();
    const { signal } = useRequestAbort();

    const [data, setData] = useState([]);
    const { openModal, closeModal } = useModal();

    const fetchData = useCallback(async () => {
        try {
            const filter = {...citiesSearchStore.cityFilter};

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
                page : citiesSearchStore.page,
                pageSize : citiesSearchStore.pageSize
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
                        <FontAwesomeIcon icon={faEdit}/>
                    </button>
                    <button
                        onClick={() => onDeleteCityClick(row)}
                        className="text-red-500 hover:underline p-2">
                        <FontAwesomeIcon icon={faTrash}/>
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
            toast.success("Country deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete the record. Please try again.");
        }
    }

    return (
        <div  className="flex-1 p-6 bg-gray-100 h-screen">
            <h1 className="h1"> {t("CITIES")}</h1>
            <div className="flex flex-col gap-4 md:flex-row">            
                <CitiesSearch fetchData={fetchData}/>

                <button
                    type="button"
                    onClick={onAddCitiesClick}
                    className="btn-common h-10 md:ml-auto"
                >
                    {t('ADD_CITY')}
                </button>
            </div>

            <BaseModal />
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
                    (newPageSize) =>{
                        citiesSearchStore.setPageSize(newPageSize);
                        citiesSearchStore.setPage(1);
                    }
                }
                highlightOnHover
                persistTableHead={true}
                paginationComponentOptions={PaginationOptions}
                noDataComponent={<NoDataMessage message="No cities available."/>} />
            </div>
        </div>
    );
});