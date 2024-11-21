import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import absenceRequestTypesListStore from "./stores/AbsenceRequestTypesListStore";
import { absenceRequestTypesService } from "../../services";
import AbsenceRequestTypesSearch from "./search/AbsenceRequestTypesSearch";
import { AbsenceRequestTypesAdd, AbsenceRequestTypesEdit } from "../absence-request-types";
import { useModal } from "../../context";
import { BaseModal, DeleteConfirmationModal } from "../../components/modal";
import { toast } from "react-toastify";
import { observer } from "mobx-react";

export const AbsenceRequestTypesList = observer (() => {
    const [loading, setLoading] = useState(true);
    const { openModal, closeModal } = useModal();

    const fetchData = async () => {
        try{
            const response = await absenceRequestTypesService.getPagedList(
                absenceRequestTypesListStore.isActive, 
                absenceRequestTypesListStore.searchQuery, 
                absenceRequestTypesListStore.pageNumber, 
                absenceRequestTypesListStore.rowsPerPage
            );
            absenceRequestTypesListStore.setData(response.items);
            absenceRequestTypesListStore.setTotalItemCount(response.totalItemCount);
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

    useEffect(()=>{
        fetchData();
    });
    
    const handlePageChange = (newPage) => {
        absenceRequestTypesListStore.setPageNumber(newPage);
    }

    const handleRowsPerPageChange = (newRowsPerPage) => {
        absenceRequestTypesListStore.setRowsPerPage(newRowsPerPage);
        absenceRequestTypesListStore.setPageNumber(1);
    };

    const handleSearch = (query, status) => {
        absenceRequestTypesListStore.setSearchQuery(query);
        absenceRequestTypesListStore.setIsActive(status);
        absenceRequestTypesListStore.setPageNumber(1);      
        fetchData();
      };
      

    
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
                data={absenceRequestTypesListStore.data}
                highlightOnHover
                pagination
                paginationServer 
                paginationTotalRows={absenceRequestTypesListStore.totalItemCount}
                paginationDefaultPage={absenceRequestTypesListStore.pageNumber} 
                paginationPerPage={absenceRequestTypesListStore.rowsPerPage} 
                onChangePage={handlePageChange} 
                onChangeRowsPerPage={handleRowsPerPageChange} 
                progressPending={loading} 
                persistTableHead={true}
                noDataComponent="No requests available."
            />
        </div>
    );
});