import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

import { absenceRequestTypesService } from "../../services";
import AbsenceRequestTypesSearch from "./search/AbsenceRequestTypesSearch";
import { AbsenceRequestTypesAdd, AbsenceRequestTypesEdit } from "../absence-request-types";
import { useModal } from "../../context";
import { BaseModal, DeleteConfirmationModal } from "../../components/modal";
import { toast } from "react-toastify";

export const AbsenceRequestTypesList = () => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isActive, setIsActive] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalItemCount, setTotalItemCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { openModal, closeModal } = useModal();

    const fetchData = async () => {
        try{
            const response = await absenceRequestTypesService.getPagedList(isActive, searchQuery, page, rowsPerPage);
            setData(response.items);
            setTotalItemCount(response.totalItemCount);
        }catch (error){
            toast.error("There was an error. Please contact administrator.")
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
            toast.error("Failed to delete the record. Please try again.");
        }
    };

    const addNewRequestClick = () => {
        openModal(<AbsenceRequestTypesAdd closeModal={closeModal} fetchData={fetchData} />);
    }

    const editRequestClick = (absenceRequestType) => {
        openModal(<AbsenceRequestTypesEdit absenceRequestType={absenceRequestType} closeModal={closeModal} fetchData={fetchData}/>);
    }

    const deleteRequestClick = (absenceRequestType) => {
        openModal(<DeleteConfirmationModal  onDelete={() => handleDelete(absenceRequestType.id)} onCancel={closeModal} name={absenceRequestType.name}/>);
    }

    const handlePageChange = (newPage) => {
        setPage(newPage);
    }

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setPage(1, newRowsPerPage);
    };

    const handleSearch = (query, status) => {
        setSearchQuery(query);
      
        let isActiveFilter = null;
        
        if (status === true) {
          isActiveFilter = true;
        } else if (status === false) {
          isActiveFilter = false;
        }
        setIsActive(isActiveFilter);
        setPage(1);      
        fetchData(query, isActiveFilter);
      };
      

    useEffect(()=>{
        fetchData();
    });

    const columns = [
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Active",
            selector: (row) => (row.isActive ? "Yes" : "No"),
            sortable: true,
        },
        {
            name: "Actions",
            cell: (row) => (
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
        },
    ];

    return (
        <div className="flex flex-col  p-4">
            <h1 className="text-xl font-bold mb-4">Absence Request Types</h1>
            
            <div className="flex justify-between items-center mb-4">
                <AbsenceRequestTypesSearch onSearch={handleSearch} />
                <button
                    type="button"
                    onClick={addNewRequestClick}
                    className="btn-new h-10"
                >
                    New Request Type
                </button>
            </div>
            <BaseModal />
            <DataTable
                columns={columns}
                data={data}
                highlightOnHover
                pagination
                paginationServer 
                paginationTotalRows={totalItemCount}
                paginationDefaultPage={page} 
                paginationPerPage={rowsPerPage} 
                onChangePage={handlePageChange} 
                onChangeRowsPerPage={handleRowsPerPageChange} 
                progressPending={loading} 
                persistTableHead={true}
                noDataComponent="No requests available."
            />
        </div>
    );
};