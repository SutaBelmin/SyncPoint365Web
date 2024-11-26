import React, { useEffect, useState } from "react";
import { citiesService } from "../../services";
import DataTable from "react-data-table-component";
import { BaseModal, DeleteConfirmationModal } from "../../components/modal";
import { useModal } from "../../context/ModalProvider";
import { CitiesAdd, CitiesEdit } from "../cities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import {CitiesSearch} from "./search/CitiesSearch";
import { observer } from "mobx-react";
import citiesSearchStore from './stores/CitiesSearchStore';
import { reaction } from "mobx";
import { useTranslation } from 'react-i18next';
import NoDataMessage from "../../components/common-ui/NoDataMessage";

export const CitiesList = observer(() => {
    const [data, setData] = useState([]);
    const { openModal, closeModal } = useModal();
    const { t } = useTranslation();

    const fetchData = async () => {

        try {
            const filter = {...citiesSearchStore.cityFilter};

            const response = await citiesService.getPagedCities(filter);

            setData(response.data.items);
            citiesSearchStore.setTotalItemCount(response.data.totalItemCount);
        } catch (error) {
            toast.error("There was an error. Please contact administrator.");
        }
    };

    useEffect(() => {
        const disposeReaction = reaction(
            () => ({
                filter : citiesSearchStore.cityFilter
            }),
            () => {
                fetchData();
            },
            {
                fireImmediately: true
            }
        );

        return () => disposeReaction();
    }, []);
    
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

    const paginationComponentOptions = {
        rowsPerPageText: t('ROWS_PER_PAGE'), 
        rangeSeparatorText: t('OF'), 
    };

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Cities</h1>
            <div className="flex justify-between items-center mb-4">
                <CitiesSearch
                />

                <button
                    type="button"
                    onClick={onAddCitiesClick}
                    className="btn-new h-10"
                >
                    {t('ADD_CITY')}
                </button>
            </div>

            <BaseModal />

            <DataTable
                columns={columns}
                data={data || []}
                pagination
                paginationServer
                paginationTotalRows={citiesSearchStore.totalItemCount}
                onChangePage={(newPage) => {
                    citiesSearchStore.setPage(newPage);
                }}
                paginationPerPage={citiesSearchStore.rowsPerPage}
                onChangeRowsPerPage={
                    (newRowsPerPage) =>{
                        citiesSearchStore.setRowsPerPage(newRowsPerPage);
                        citiesSearchStore.setPage(1);
                    }
                }
                highlightOnHover
                persistTableHead={true}
                paginationComponentOptions={paginationComponentOptions}
                noDataComponent={<NoDataMessage message="No cities available."/>} />

        </div>
    );
}
);