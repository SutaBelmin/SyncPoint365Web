import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import absenceRequestTypesSearchStore from "./stores/AbsenceRequestTypesSearchStore";
import { absenceRequestTypesService } from "../../services";
import AbsenceRequestTypesSearch from "./search/AbsenceRequestTypesSearch";
import { AbsenceRequestTypesAdd, AbsenceRequestTypesEdit } from "../absence-request-types";
import { useModal } from "../../context";
import { BaseModal, DeleteConfirmationModal } from "../../components/modal";
import { toast } from "react-toastify";
import { observer } from "mobx-react";
import { reaction } from "mobx"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export const AbsenceRequestTypesList = observer (() => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { openModal, closeModal } = useModal();
    
    const customNoDataComponent = (
        <div className="no-data-message">
            No requests available.
        </div>
    );
    
    const fetchData = async () => {
        try{
            const response = await absenceRequestTypesService.getPagedList(
                absenceRequestTypesSearchStore.absenceRequestFilter
            );
            setData(response.items);
            absenceRequestTypesSearchStore.setTotalItemCount(response.totalItemCount);
        }catch (error){
            toast.error("There was an error. Please contact administrator.")
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (absenceRequestTypeId) => {
        try {
            await absenceRequestTypesService.delete(absenceRequestTypeId);
            fetchData();
            closeModal();
        } catch (error) {
            toast.error("Failed to delete the record. Please try again.");
        }
    }

    const addNewRequestClick = () => {
        openModal(<AbsenceRequestTypesAdd closeModal={closeModal} fetchData={fetchData} />);
    }

    const editRequestClick = (absenceRequestType) => {
        openModal(<AbsenceRequestTypesEdit absenceRequestType={absenceRequestType} closeModal={closeModal} fetchData={fetchData}/>);
    }

    const deleteRequestClick = (absenceRequestType) => {
        openModal(<DeleteConfirmationModal  onDelete={() => handleDelete(absenceRequestType.id)} onCancel={closeModal} name={absenceRequestType.name}/>);
    }

    useEffect(() => {
        const disposer = reaction(
            () => [
                absenceRequestTypesSearchStore.absenceRequestFilter
            ],
            () => {
                fetchData();
            }, {
                fireImmediately: true
            }
        );
        return () => disposer();
    }, []);
    
    const handlePageChange = (newPage) => {
        absenceRequestTypesSearchStore.setPageNumber(newPage);
    }

    const handleRowsPerPageChange = (newRowsPerPage) => {
        absenceRequestTypesSearchStore.setRowsPerPage(newRowsPerPage);
        absenceRequestTypesSearchStore.setPageNumber(1);
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
                    <button type="button" onClick={() => editRequestClick(row)} className="text-blue-500 hover:underline p-2">
                        <FontAwesomeIcon icon ={faEdit} className="mr-3"/>
                    </button>
                    <button type="button" onClick={() => deleteRequestClick(row)} className="text-red-500 hover:underline p-2">
                        <FontAwesomeIcon icon={faTrash} className="mr-3"/>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-col  p-4">
            <h1 className="text-xl font-bold mb-4">Absence Request Types</h1>
            <div className="flex justify-between items-center mb-4">
                <AbsenceRequestTypesSearch />
                <button
                    type="button"
                    onClick={addNewRequestClick}
                    className="btn-new h-10">
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
                paginationTotalRows={absenceRequestTypesSearchStore.totalItemCount}
                paginationDefaultPage={absenceRequestTypesSearchStore.pageNumber} 
                paginationPerPage={absenceRequestTypesSearchStore.rowsPerPage} 
                onChangePage={handlePageChange} 
                onChangeRowsPerPage={handleRowsPerPageChange} 
                progressPending={loading} 
                persistTableHead={true}
                noDataComponent={customNoDataComponent} 
            />
        </div>
    );
});