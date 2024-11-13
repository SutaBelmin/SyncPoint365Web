import React from "react";
import { BaseModal } from "../../components/modal";
import { useModal } from "../../context/ModalProvider";
import CountriesAdd from "./CountriesAdd";
import countriesService from "../../services/countriesService";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

const CountriesList = () => {
    const {openModal, closeModal} = useModal();

    const [data, setData] = useState([]);

    const fetchData = async () => {
        try{
            const response = await countriesService.getCountries();
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

    const columns = [
        {
            name: 'Full Name',
            selector: row => row.name,
            sortable: true,
        },
        {   
            name: 'Display Name',
            selector: row => row.displayName,
            sortable: true,
        }
    ];

    return (
        <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Countries</h1>
        <div className="flex justify-end mb-4">
            <button
                type='button'
                onClick={onAddCountriesClick}
                className="rounded bg-gray-700 text-white px-4 py-2 hover:bg-gray-600"
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
            noDataComponent="No users available." />

    </div>
    );
};

export default CountriesList;