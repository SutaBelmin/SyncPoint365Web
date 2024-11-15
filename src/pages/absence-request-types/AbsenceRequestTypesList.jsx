import React, { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';

import { absenceRequestTypeService } from "../../services";
import { AbsenceRequestTypesAdd } from "../absence-request-types";
import { useModal } from "../../context";
import { BaseModal } from '../../components/modal';
import './AbsenceRequestTypesList.css';

export const AbsenceRequestTypesList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { openModal, closeModal } = useModal();

    const fetchData = async () => {
        try {
            const response = await absenceRequestTypeService.getList();
            setData(response.data);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const addNewRequestClick = () => {
        openModal(<AbsenceRequestTypesAdd closeModal={closeModal} fetchData={fetchData} />);
    };

    useEffect(() => {
        fetchData();
    }, []);

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

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Absence Request Types</h1>
            <div className="flex justify-end mb-4">
                <button
                    type="button"
                    onClick={addNewRequestClick}
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
                noDataComponent="No requests available." 
            />
        </div>
    );
};