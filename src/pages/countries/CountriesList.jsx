import React, { useCallback, useEffect, useState } from "react";
import { BaseModal, DeleteConfirmationModal } from "../../components/modal";
import { useModal } from "../../context/ModalProvider";
import { CountriesAdd, CountriesEdit } from "../countries";
import { countriesService } from "../../services";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

export const CountriesList = () => {
    const { openModal, closeModal } = useModal();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalItemCount, setTotalItemCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState(""); 

    const customNoDataComponent = (
        <div className="no-data-message">
            No requests available.
        </div>
    );

    const fetchData = useCallback(async () => {
        try {
            const query = searchTerm ? `&query=${searchTerm}` : '';
            console.log("Query being sent:", query);
    
            const response = await countriesService.getPagedList(page, rowsPerPage, query);
            console.log('API Response:', response);
    
            const responseData = response.data?.items || response.data;
            console.log('Response Data:', responseData);
            setData(responseData);
            setTotalItemCount(response.data.totalItemCount || responseData.length);
    
        } catch (error) {
            console.error("Error in fetching data:", error); 
            toast.error("There was an error. Please contact administrator.");
        }
    }, [page, rowsPerPage, searchTerm]);
    
    
    useEffect(() => {
        fetchData();
    }, [fetchData, rowsPerPage, page, searchTerm]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleRowsPerChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setPage(1);
    };

    const onAddCountriesClick = () => {
        openModal(<CountriesAdd closeModal={closeModal} fetchData={fetchData} />);
    };

    const onEditCountriesClick = (country) => {
        const modalProps = { country, closeModal, fetchData };
        openModal(<CountriesEdit {...modalProps} />);
    };

    const onDeleteCountriesClick = (country) => {
        openModal(<DeleteConfirmationModal entityName={country.name} onDelete={() => handleDelete(country.id)} onCancel={closeModal} />);
    };

    const handleDelete = async (countryId) => {
        try {
            await countriesService.delete(countryId);
            fetchData();
            closeModal();
            toast.success("Country deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete country. Please try again.");
        }
    };

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
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <button type="button" onClick={() => onEditCountriesClick(row)} className="text-blue-500 hover:underline p-2">
                        <FontAwesomeIcon icon={faEdit} className="mr-3" />
                    </button>
                    <button type="button" onClick={() => onDeleteCountriesClick(row)} className="text-red-500 hover:underline p-2">
                        <FontAwesomeIcon icon={faTrash} className="mr-3" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Countries</h1>
            <div className="flex justify-end mb-4">
                <button type="button" onClick={onAddCountriesClick} className="btn-new">
                    Add Country
                </button>
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    className="p-2 border"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <BaseModal />
            <DataTable
                columns={columns}
                data={data || []}
                pagination
                paginationServer
                paginationTotalRows={totalItemCount || 0}
                onChangePage={handlePageChange}
                paginationPerPage={rowsPerPage}
                onChangeRowsPerPage={handleRowsPerChange}
                highlightOnHover
                persistTableHead={true}
                noDataComponent={customNoDataComponent}
            />
        </div>
    );
};
