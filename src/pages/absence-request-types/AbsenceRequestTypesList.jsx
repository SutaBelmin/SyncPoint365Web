import React, { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';

import { absenceRequestTypesService } from "../../services";
import { AbsenceRequestTypesAdd, AbsenceRequestTypesEdit } from "../absence-request-types";
import { useModal } from "../../context";
import { BaseModal, DeleteConfirmationModal } from '../../components/modal';
import './AbsenceRequestTypesList.css';
import { toast } from "react-toastify";

export const AbsenceRequestTypesList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { openModal, closeModal } = useModal();

    const fetchData = async () => {
        try {
            const response = await absenceRequestTypesService.getList();
            setData(response.data);
        } catch (error) {
            toast.error("There was an error. Please contact administrator.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (absenceRequestTypeId) => {
        try {
            await absenceRequestTypesService.delete(absenceRequestTypeId);
            fetchData();
            closeModal();
        } catch (error) {
           
        }
    };

    const addNewRequestClick = () => {
        openModal(<AbsenceRequestTypesAdd closeModal={closeModal} fetchData={fetchData} />);
    };

    const editRequestClick = (absenceRequestType) => {
        const modalProps = {absenceRequestType, closeModal, fetchData};
        openModal(<AbsenceRequestTypesEdit {... modalProps}/>);
    }

    const deleteRequestClick = (absenceRequestType) => {
        openModal(<DeleteConfirmationModal onDelete={()=>handleDelete(absenceRequestType.id)} onCancel={closeModal} name={absenceRequestType.name}/>);
    }

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
            name: "Active",
            selector: (row) => row.isActive ? "Yes" : "No", 
            sortable: true
        },
        {
            name: "Actions",
            cell: row => (
                <div className="flex space-x-2">
                    <button
                        type="button"
                        onClick={() => editRequestClick(row)}
                        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500"
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => deleteRequestClick(row)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
                    >
                        Delete
                    </button>
                </div>
            ),
        }
    ];

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Absence Request Types</h1>
            <div className="flex justify-end mb-4">
                <button
                    type="button"
                    onClick={addNewRequestClick}
                    className="btn-new"
                >
                    New Request Type
                </button>
            </div>
            <BaseModal />
            <DataTable
                columns={columns}
                data={data}
                highlightOnHover
                progressPending={loading}  
                persistTableHead={true}
                noDataComponent="No requests available." 
            />
        </div>
    );
}