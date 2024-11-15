import React from "react";
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
    

    const fetchData = async () => {
        try{
            const response = await countriesService.getList();
            setData(response.data);
        }catch (error){
            console.error("Error fetching countries:", error);
        }
    };

    useEffect(()=>{
        fetchData();
    }, []);

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
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                Add Country
            </button>
        </div>
        <BaseModal />

        <DataTable
            columns={columns}
            data={data}
            pagination
            highlightOnHover
            persistTableHead={true}
            noDataComponent="No countries available." />

    </div>
    );
};
