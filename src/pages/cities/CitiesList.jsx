import { useCallback, useEffect, useState } from "react";
import { citiesService, countriesService } from "../../services";
import DataTable from "react-data-table-component";
import { BaseModal, DeleteConfirmationModal } from "../../components/modal";
import { useModal } from "../../context/ModalProvider";
import { CitiesAdd, CitiesEdit } from "../cities";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from "react-toastify";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";

export const CitiesList = () => {
    const [data, setData] = useState([]);
    const { openModal, closeModal } = useModal();
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItemCount, setTotalItemCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [countries, setCountries] = useState([]);
    const [selectedCountryId, setSelectedCountryId] = useState(null);

    const fetchData = useCallback(async (searchQuery = "", countryId = null) => {
        try {
            const response = await citiesService.getPagedCities(countryId, searchQuery, page, rowsPerPage, null);
            setData(response.data.items);
            setTotalItemCount(response.data.totalItemCount);

        } catch (error) {
            toast.error("There was an error. Please contact administrator.");
        }
    }, [page, rowsPerPage]);

    const fetchCountries = useCallback(async () => {
        try {
            const response = await countriesService.getList();
            const countriesOption = response.data.map(country => ({
                value: country.id,
                label: country.name
            }));
            setCountries(countriesOption);
        } catch (error) {
            toast.error("There was an error. Please contact administrator.");
        }
    }, []);

    useEffect(() => {
        fetchCountries();
        fetchData(searchTerm, selectedCountryId?.value);
    }, [fetchCountries, fetchData, searchTerm, selectedCountryId]);

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
        openModal(<DeleteConfirmationModal entityName={city.name} onDelete={() => handleDelete(city.id)} onCancel={closeModal} />);
    }

    const handleDelete = async (cityId) => {
        try {
            await citiesService.delete(cityId);
            fetchData();
            closeModal();
        } catch (error) {

        }
    }

    const handlePageChange = (newPage) => {
        setPage(newPage);
    }

    const handleRowsPerPage = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setPage(1);
    };


    const handleSearch = (value) => {
        setSearchTerm(value);  
        setPage(1);  
    };

    const handleCountryChange = (selectedOption) => {
        setSelectedCountryId(selectedOption);
        setPage(1);
    }

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCountryId(null);
        setPage(1);
        fetchData();
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search by City"
                        className="input-search h-10 rounded-md border-gray-300 w-[25rem]"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />

                    <Select
                        value={selectedCountryId}
                        onChange={handleCountryChange}
                        options={countries}
                        placeholder="Select Country"
                        isClearable
                        className="h-10 border-gray-300 input-select-border w-[25rem]"
                    />

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="btn-clear h-10 bg-gray-700 text-white hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-md border border-gray-300 font-bold text-sm">
                        Clear Filters
                    </button>
                </div>

                <button
                    type='button'
                    onClick={onAddCitiesClick}
                    className="btn-new h-10">
                    Add City
                </button>
            </div>

            <BaseModal />

            <DataTable
                columns={columns}
                data={data || []}
                pagination
                paginationServer
                paginationTotalRows={totalItemCount}
                onChangePage={handlePageChange}
                paginationPerPage={rowsPerPage}
                onChangeRowsPerPage={(newRowsPerPage) => handleRowsPerPage(newRowsPerPage)}
                highlightOnHover
                persistTableHead={true}
                noDataComponent="No cities available" />

        </div>
    );
}