import React, { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';

import AbsenceRequestTypesAdd from "./AbsenceRequestTypesAdd";
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
        openModal(<AbsenceRequestTypesAdd />);
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Absence Request Types</h1>
            <div className="flex justify-end mb-4">
                <button
                    type='button'
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
