import React, { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';

import absenceRequestTypeService from "../../services/absenceRequestTypeService";
import { useModal } from "../../context/ModalProvider";
import { BaseModal } from '../../components/modal';
import './AbsenceRequestTypesList.css';

const columns = [
    {
        name: "Name",
        selector: (row) => row.name, 
        sortable: true
    },
    {
        name: "IsActive",
        selector: (row) => row.isActive ? "Yes" : "No", 
        sortable: true
    }
];

const AbsenceRequestTypesList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { openModal } = useModal();

    const fetchData = async () => {
        try {
            const response = await absenceRequestTypeService.getAbsenceRequestTypes();
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false); 
        }
    }; 

    useEffect(() => {
        fetchData();
    }, []);

    const handleNewRequest = () => {
        const modalContent = (
            <div>
                <h2 className="text-xl font-semibold mb-4">New Absence Request</h2>
                <form>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter your name" 
                        />
                    </div>
                    
                    <div className="mb-4 flex items-center">
                        <input 
                            type="checkbox" 
                            id="isActive" 
                            name="isActive" 
                            className="h-4 w-4 border-gray-300 rounded mr-2"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        );
        openModal(modalContent);
    };
    

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Absence Request Types</h1>
            <div className="flex justify-end mb-4">
                <button
                    type="button"
                    onClick={handleNewRequest}
                    className="rounded bg-gray-700 text-white px-4 py-2 hover:bg-gray-600"
                >
                    New Request
                </button>
            </div>
            <BaseModal /> 

            <DataTable
                columns={columns}
                data={data}
                highlightOnHover
                progressPending={loading}  
                noDataComponent="No request types available." 
            />
        </div>
    );
};

export default AbsenceRequestTypesList;
