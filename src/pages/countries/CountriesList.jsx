import React, {useCallback} from "react";
import { BaseModal, DeleteConfirmationModal } from "../../components/modal";
import { useModal } from "../../context/ModalProvider";
import {CountriesAdd, CountriesEdit} from "../countries"
import {countriesService} from "../../services";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

export const CountriesList = () => {
    const {openModal, closeModal} = useModal();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalItemCount, setTotalItemCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchData = useCallback (async () => {
        try{
            console.log(rowsPerPage);
            const response = await countriesService.getPagedList(page, rowsPerPage);
            console.log(response.data)
            setData(response.data.items);
            setTotalItemCount(response.data.totalItemCount);
        }catch (error){
            toast.error("There was an error. Please contact administrator.")
        }
    },  [page, rowsPerPage]);

    useEffect(()=>{
        fetchData();
    }, [fetchData, rowsPerPage, page]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleRowsPerChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        console.log(newRowsPerPage);
        setPage(1);
    };

    const onAddCountriesClick = () =>{
        openModal(<CountriesAdd closeModal={closeModal} fetchData={fetchData}/>);
    };

    const onEditCountriesClick = (country) => {
        const modalProps = {country, closeModal, fetchData};
        openModal(<CountriesEdit {...modalProps} />);
    }

    const onDeleteCountriesClick = (country) => {
        openModal(<DeleteConfirmationModal entityName={country.name} onDelete={()=>handleDelete(country.id)} onCancel={closeModal}/>);
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
                <button
                type="button"
                onClick={()=>onEditCountriesClick(row)}
                className="p-2"
                >
                <FontAwesomeIcon icon={faPen} className="text-lg"/>
                </button>
                 <button
                 type="button"
                 onClick={() => onDeleteCountriesClick(row)}
                 className="p-2" 
                >
                 <FontAwesomeIcon icon={faTrashAlt} className="text-lg"/>
             </button>
             </div>
            )
        }
    ];

    return (
        <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Countries</h1>
        <div className="flex justify-end mb-4">
            <button
                type='button'
                onClick={onAddCountriesClick}
                className="btn-new"
            >
                Add Country
            </button>
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
            noDataComponent="No countries available." />
    </div>
    );
};
