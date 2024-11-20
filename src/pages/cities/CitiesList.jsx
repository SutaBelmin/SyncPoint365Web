import React, { useCallback, useEffect, useState } from "react";
import { citiesService } from "../../services";
import DataTable from "react-data-table-component";
import { BaseModal, DeleteConfirmationModal } from "../../components/modal";
import { useModal } from "../../context/ModalProvider";
import { CitiesAdd, CitiesEdit } from "../cities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import CitiesSearch from "./search/CitiesSearch";
import { observer } from "mobx-react";
import { citiesListStore } from "../cities";


export const CitiesList = observer(() => {
    const [data, setData] = useState([]);
    const { openModal, closeModal } = useModal();
    // const [page, setPage] = useState(1);
    // const [rowsPerPage, setRowsPerPage] = useState(10);
    // const [totalItemCount, setTotalItemCount] = useState(0);
    // const [countries, setCountries] = useState([]);
    // const [searchParams, setSearchParams] = useState({ searchQuery: "", countryId: null });

    const fetchData = useCallback(async () => {
        console.log("store", citiesListStore);

        try {
            //const filter = { ...citiesListStore.cityFilter }
            const response = await citiesService.getPagedCities(
                citiesListStore.countryId,
                citiesListStore.searchQuery,
                citiesListStore.page,
                citiesListStore.rowsPerPage,
                null
            );
            console.log("podaci", response);
            setData(response.data.items);
            citiesListStore.setTotalItemCount(response.data.totalItemCount);
        } catch (error) {
            toast.error("There was an error. Please contact administrator.");
        }
    }, [citiesListStore.searchQuery, citiesListStore.countryId, citiesListStore.page, citiesListStore.rowsPerPage]);

    useEffect(() => { 
        fetchData();
    }, [fetchData]);

    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Display Name',
            selector: row => row.displayName,
            sortable: true,
        },
        {
            name: 'Country Name',
            selector: row => row.country?.name,
            sortable: true,
        },
        {
            name: 'Postal Code',
            selector: row => row.postalCode,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEditCityClick(row)}
                        className="text-blue-500 hover:underline p-2">
                        <FontAwesomeIcon icon={faEdit} className="mr-3" />
                    </button>
                    <button
                        onClick={() => onDeleteCityClick(row)}
                        className="text-red-500 hover:underline p-2">
                        <FontAwesomeIcon icon={faTrash} className="mr-3" />
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
            toast.success("Successfully deleted");
        } catch (error) {
            toast.error("There was an error. Please contact administrator.");
        }
    }

    const handlePageChange = (newPage) => {
        citiesListStore.setPage(newPage);
    }

    const handleRowsPerPage = (newRowsPerPage) => {
        citiesListStore.setRowsPerPage(newRowsPerPage);
        citiesListStore.setPage(1);
    };

    const onSearch = (params) => {
        citiesListStore.setSearchParams(params);
        citiesListStore.setPage(1);
    };

    const clearFilters = () => {
        citiesListStore.clearFilters();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <CitiesSearch
                   
                />

                <button
                    type="button"
                    onClick={onAddCitiesClick}
                    className="btn-new h-10"
                >
                    Add City
                </button>
            </div>

            <BaseModal />

            <DataTable
                columns={columns}
                data={data || []}
                pagination
                paginationServer
                paginationTotalRows={citiesListStore.totalItemCount}
                onChangePage={handlePageChange}
                paginationPerPage={citiesListStore.rowsPerPage}
                onChangeRowsPerPage={(newRowsPerPage) =>
                    handleRowsPerPage(newRowsPerPage)
                }
                highlightOnHover
                persistTableHead={true}
                noDataComponent="No cities available"
            />
        </div>
    );
}
);