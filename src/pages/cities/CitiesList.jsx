import { useEffect, useState } from "react";
import { citiesService } from "../../services";
import DataTable from "react-data-table-component";
import './CitiesList.css';
import { BaseModal, DeleteConfirmationModal } from "../../components/modal";
import { useModal } from "../../context/ModalProvider";
import { CitiesAdd, CitiesEdit } from "../cities";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from "react-toastify";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export const CitiesList = () => {
    const [data, setData] = useState([]);
    const { openModal, closeModal } = useModal();

    const fetchData = async () => {
        try {
            const response = await citiesService.getList();
            setData(response.data);
        } catch (error) {
            toast.error("There was an error. Please contact administrator.");
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
        openModal(<DeleteConfirmationModal entityName={city.name} onDelete={()=>handleDelete(city.id)} onCancel={closeModal}/>);
    }

    const handleDelete = async (cityId) => {
        try {
            await citiesService.delete(cityId);
            fetchData();
            closeModal();
        } catch (error) {
            
        }
    }

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button
                    type='button'
                    onClick={onAddCitiesClick}
                    className="btn-new">
                    Add City
                </button>
            </div>

            <BaseModal />

            <DataTable
                columns={columns}
                data={data}
                pagination
                highlightOnHover
                persistTableHead={true}
                noDataComponent="No cities available" />

        </div>
    );
}