import { useEffect, useState } from "react";
import cityService from "../../services/citiesService";
import DataTable from "react-data-table-component";
import './CitiesList.css';
import { BaseModal } from "../../components/modal";
import { useModal } from "../../context/ModalProvider";
import {CitiesAdd, CitiesEdit} from "../cities";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from "@fortawesome/free-solid-svg-icons";

export const CitiesList = () => {
    const [data, setData] = useState([]);
    const {openModal, closeModal} = useModal();

    const fetchData = async () => {
        try {
            const response = await cityService.getList();
            setData(response.data);
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchData();
    }, []);

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
            selector: row => row.country.name,
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
                <button
                onClick={()=> onEditCityClick(row)}
                className="text-blue-500 hover:underline">
                    <FontAwesomeIcon icon={faEdit} className="mr-3" />
                </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
        
    ];

    const onAddCitiesClick = () => {
        openModal(<CitiesAdd closeModal={closeModal} fetchData={fetchData}/>);
    }

   const onEditCityClick = (city) => {
    openModal(<CitiesEdit city={city} closeModal={closeModal} fetchData={fetchData} />)
   }

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button
                type='button'
                onClick={onAddCitiesClick}
                className="rounded bg-gray-700 text-white px-4 py-2 hover:bg-gray-600">
                    Add City
                </button>
            </div>

            <BaseModal />

            <DataTable
                columns={columns}
                data={data}
                pagination
                highlightOnHover
                noDataComponent="No cities available" />

        </div>
    );
}