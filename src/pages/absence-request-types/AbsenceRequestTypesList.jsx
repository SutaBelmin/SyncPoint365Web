import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import DataTable from "react-data-table-component";
import absenceRequestTypesSearchStore from "./stores/AbsenceRequestTypesSearchStore";
=======
import DataTable from 'react-data-table-component';
>>>>>>> 4152f9a (Adding translations for every page.)
import { absenceRequestTypesService } from "../../services";
import AbsenceRequestTypesSearch from "./search/AbsenceRequestTypesSearch";
import { AbsenceRequestTypesAdd, AbsenceRequestTypesEdit } from "../absence-request-types";
import { useModal } from "../../context";
import { BaseModal, DeleteConfirmationModal } from "../../components/modal";
import { toast } from "react-toastify";
<<<<<<< HEAD
import { observer } from "mobx-react";
import { reaction } from "mobx"
=======
import { useTranslation } from 'react-i18next';
>>>>>>> 4152f9a (Adding translations for every page.)


export const AbsenceRequestTypesList = observer (() => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { openModal, closeModal } = useModal();
<<<<<<< HEAD
    
    
=======
    const { t } = useTranslation();
>>>>>>> 4152f9a (Adding translations for every page.)

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
            name: t('NAME'),
            selector: (row) => row.name, 
            sortable: true
        },
        {
            name: t('ACTIVE'),
            selector: (row) => row.isActive ? "Yes" : "No", 
            sortable: true
        },
        {
            name: t('ACTIONS'),
            cell: row => (
                <div className="flex space-x-2">
                    <button
                        type="button"
                        onClick={() => editRequestClick(row)}
                        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500"
                    >
                        {t('EDIT')}
                    </button>
                    <button
                        type="button"
                        onClick={() => deleteRequestClick(row)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
                    >
                        {t('DELETE')}
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">{t('ABSENCE_REQUEST_TYPES')}</h1>
            <div className="flex justify-end mb-4">
                <button
                    type="button"
                    onClick={addNewRequestClick}
                    className="btn-new"
                >
                    {t('NEW_REQUEST_TYPE')}
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
                noDataComponent="No requests available." 
            />
        </div>
    );
});